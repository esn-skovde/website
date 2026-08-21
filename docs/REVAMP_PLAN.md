# ESN Skövde — Website Revamp Proposal

**Branch:** `revamp/2026-modern-ui` · **Drafted:** 2026-08-21

---

## 1. What the site is today

A 7-language React SPA (Vite + Tailwind + React Router, prerendered to static
HTML for GitHub Pages) serving international students in Skövde. Six pages:
Home, Events, New to Skövde, ESNcard, Board, Contact. Events and Trips come from
Supabase; everything else is JSON/i18n content.

The information is good. The problem is that it *looks* and *feels* like a 2023
Tailwind starter, and it is slow for the exact reason students notice most:
images.

## 2. Why it feels slow — measured, not guessed

| Issue | Detail | Impact |
|---|---|---|
| Unoptimised images | ~6.5 MB across 25 files. `board/president.jpeg` is **4080×1884 / 1.7 MB** rendered into a ~300 px card. `esn-card.png` is 3000×3000 / 704 KB. `hero.png` is a 908 KB PNG of a photograph. | Dominant cause of slow loads and janky scroll |
| Global `MutationObserver` | `useImageCredits` observes `document.body` with `childList + subtree + attributes` for the entire session, and re-scans the DOM on **every** mutation — including the ones it causes itself | Continuous main-thread work; scroll and route jank |
| No lazy loading | Every image is eager, no `width`/`height`, no `srcset` | Layout shift + bandwidth waste |
| Both hero images always downloaded | Desktop and mobile heroes are both in the DOM, hidden with `hidden md:block` | ~1.3 MB downloaded, half of it discarded |
| Theme applied after mount | `ThemeProvider` sets the `dark` class in `useEffect` | White flash on every cold load in dark mode |

## 3. Bugs found while reading the code

1. **Supabase crash → blank page.** With no `VITE_SUPABASE_*` env vars, `createClient`
   throws at module scope. There is no error boundary, so `/events` renders a
   **white screen**. Any Supabase outage does the same in production.
2. **`en-US` breaks every internal link.** The language detector reads `navigator.language`
   (`en-US`), so `langPrefix` becomes `/en-US` and links point at `/en-US/events`,
   which is not a real route. Reproduced in the browser console.
3. **Kelson Sans never loads.** `index.html` tries `@import url('…kelson-sans-700-normal.otf')`
   — `@import` takes a *stylesheet*, not a font file. The whole site has silently been
   rendering in the system fallback for two years.
4. **Zoom is disabled.** `maximum-scale=1.0, user-scalable=no` in the viewport meta —
   a WCAG 1.4.4 failure, and a real problem for an audience reading a second language.
5. **404 page hijacks the browser.** Auto-redirects to `/` after 5 seconds, and to `/`
   rather than the current language.
6. **`console.log(langPrefix)`** ships in `SplitSection`.
7. **Dead code:** `LanguageSwitcher.jsx` (unused, references `primary-*` classes that
   don't exist), `Testimonials` (imported, commented out), `App.css` (empty).

## 4. Design direction — "Starfield"

ESN's own visual identity is a five-pointed star in five fixed colours. Most ESN
section sites pick one of them (usually cyan) and ignore the rest. This design
uses **all five as a signal system**, which is both distinctly on-brand and
distinctly not a generic Tailwind site.

**Ground.** Deep navy-black `#0A0E1A` — Swedish winter night — with cool
blue-biased neutrals rather than default greys. Light theme is a cool near-white
`#F7F8FB`, designed as a peer, not an inversion.

**The five signals.** Cyan `#00AEEF`, magenta `#EC008C`, green `#7AC143`,
orange `#F47B20`, indigo `#2E3192`. Each top-level page owns one and carries it
through its eyebrows, hairlines and focus states:

| Page | Signal |
|---|---|
| Home | Cyan |
| Events | Magenta |
| New to Skövde | Green |
| ESNcard | Orange |
| Board | Indigo |

**Type.** Display: **Outfit** — a geometric sans, the closest free relative of
ESN's mandated Kelson Sans, set large with tight negative tracking. Body:
**Instrument Sans**. Both from Google Fonts with `display=swap`, so they
actually load, unlike today.

**Layout.** A full-bleed hero built on a light burst derived from the ESN star,
then an asymmetric bento grid rather than the current three identical
image-left / text-right slabs. Hairline borders, 20 px radii, glass surfaces used
sparingly (they cost paint time).

**Motion.** One orchestrated hero reveal on load, one-shot staggered reveals on
scroll via `IntersectionObserver`, hover lift on cards. All of it behind
`prefers-reduced-motion: reduce`. No animation library — the budget goes to images.

## 5. Scope of work

**A. Foundation**
- Design tokens as CSS custom properties (`--surface`, `--ink`, `--signal`, …) wired
  into `tailwind.config.js`, so the whole site is re-themeable from one file.
- Semantic component classes replace the ~40-instance `dark:bg-gray-800` pattern.
- Inline theme script in `index.html` to kill the flash; theme toggle gains a
  system/light/dark tri-state.
- Real `@font-face` / Google Fonts loading.

**B. Performance**
- Re-encode all images to WebP at sane display dimensions (`cwebp`, committed).
  Target: 6.5 MB → under 800 KB.
- `<picture>` with `srcset`, explicit dimensions, `loading="lazy"`, `decoding="async"`.
  Hero uses `<picture>` so only one of the two heroes is ever fetched.
- Delete the global `MutationObserver`; image credits become a normal React component.

**C. Correctness**
- Error boundary around the router; Supabase degrades to an empty state instead of
  a white screen, and the client is only constructed when configured.
- Normalise `en-US` → `en` at the i18n layer and in the URL, with a whitelist.
- Restore pinch-zoom; add a skip link, visible focus rings, and `aria-current`.
- 404 stops redirecting; it offers language-aware links instead.
- Remove dead code and the stray `console.log`.

**D. Pages** — rebuilt on the new system: Home, Events, New to Skövde, ESNcard,
Board, Contact, 404. Content and all seven translations are preserved; a small
number of new keys are added for new UI, with English fallback.

**E. Verification** — every page walked in the browser at desktop, tablet and mobile
widths, in both themes, in more than one language, with the console watched for
errors, plus a production `build:ssg` run.

## 6. Explicitly out of scope

- No framework change. Staying on Vite + React keeps the GitHub Pages deploy and
  the prerender script working exactly as they do now.
- No CMS. Board and footer data stay as JSON, events stay in Supabase.
- No new copy. Translations are reused; nothing is rewritten in six languages.

## 7. Risks

- **Translation drift.** New UI strings land in English across all seven files until
  translated. Mitigated by keeping new keys few and obvious.
- **Image re-encoding is lossy and committed.** Originals stay in git history.
- **Kelson Sans.** ESN brand guidelines mandate it; the licence does not permit
  self-hosting from the ESN Sweden URL. Outfit is proposed as the free stand-in —
  if the section has a licensed copy, dropping it in is a one-file change.
