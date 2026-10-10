# ESN Skövde Website

**Live Website**: [https://esnskovde.org/](https://esnskovde.org/)

A multilingual website for ESN Skövde (Erasmus Student Network) built with React 19, Vite and Tailwind CSS, featuring events, trips, board information, and resources for international students in Skövde, Sweden.

It ships as a static site: Vite builds the SPA, then a prerender step renders every route in a headless browser so each of the 7 languages × 6 pages has real HTML for crawlers and for the first paint.

## Features

- **Six pages in seven languages.** Home, Events, New to Skövde, ESNcard, Board and Contact, in English, Swedish, Spanish, German, Norwegian, French and Italian. Every route is prerendered, so each page is real HTML before any JavaScript runs.
- **Events and trips** from Supabase, with sample data when it is not configured. Dates and times are always shown in Stockholm time, in the reader's language, and every event and trip can be added to a calendar (`.ics`).
- **Light, dark or system theme**, on a design system built from ESN's five star colours and the brand typeface, Kelson Sans.
- **A fast first load.** Responsive WebP images, one translation chunk per language, and no layout shift while the app takes over the prerendered page.
- **Accessible.** Text meets WCAG AA contrast in both themes, the site works by keyboard, the trips carousel can be paused, the interface is translated, and pinch-zoom is never disabled.
- **Works without JavaScript.** Content stays visible, every language is linked from the footer, and printing shows every section.
- **Search and sharing.** One canonical URL per page, hreflang for all seven languages, a generated sitemap, structured data and a share image. Old and mistyped URLs redirect to the right page.

The redesign proposal this version was built from is in
[`docs/REVAMP_PLAN.md`](docs/REVAMP_PLAN.md).

## Tech stack

React 19, Vite 6 and Tailwind CSS 3, with react-router 7 for routing, i18next for
translations and Supabase (`@supabase/supabase-js`) for events and trips. Sonner shows
toasts and lucide-react supplies the icons. Puppeteer drives the prerender and the
smoke test.

# How to contribute?

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 20 or higher)
- npm or yarn
- Git

Optional, and only if you are adding or replacing images:
- [`cwebp`](https://developers.google.com/speed/webp/download) — `brew install webp` on macOS, `apt install webp` on Debian/Ubuntu. The optimized WebP files are committed, so you do not need it for a normal build.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/esn-skovde-website.git
cd esn-skovde-website
```

### SEO assets

Two files under `public/` are served verbatim at stable, unhashed URLs, because
both are quoted by absolute URL in `<head>` and by other sites:

| File | Used as | Notes |
|---|---|---|
| `public/og-image.jpg` | `og:image`, `twitter:image` | 1200×630, JPEG. Regenerate with `node scripts/generate-og-image.js` after changing the artwork or wording. |
| `public/logo.png` | schema.org `Organization.logo` | Square, 182×182. Must stay square and ≥112px or Google drops the logo from rich results. |

Do not point either at anything under `src/assets/` — Vite hashes and re-encodes
that directory, so the URL changes every build. `og:image` pointed at
`/assets/logo.png` for two years, which no build has ever emitted, and every
share rendered with no preview image.

`dist/sitemap.xml` is **generated** by `scripts/prerender.js` from the same route
list it prerenders, so the two cannot drift. There is deliberately no
`public/sitemap.xml`: the hand-kept one drifted into advertising five URLs
(`/events`, `/board`, …) that have never existed on this language-prefixed site.

Every page URL ends in a slash: `/en/events/`, never `/en/events`. GitHub Pages
serves a page only at that form and answers the other with a 301, so canonical,
`og:url`, hreflang and sitemap URLs and every internal link use it.
`scripts/serve-static.js` redirects the same way, so a slashless link shows up
when the build is checked locally.

Those old unprefixed URLs are still in search results and on printed QR codes,
so they redirect to the page in the visitor's language: the prerender writes a
small redirect page at each (`dist/events/index.html` and so on), which is
`noindex` and stays out of the sitemap. The app sends every other spelling of a
page's URL to the one it has, too: `/SV/` to `/sv/`, `/en-US/board` to
`/en/board/`, and a mistyped page to the 404 page in the visitor's language.
Norwegian browsers, which report `nb` or `nn`, get the Norwegian pages.

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the sample environment file:

```bash
cp .env.sample .env.local
```

It ships with both Supabase values empty, and that is a working setup, so you
can stop here. Without credentials the Events page has nothing to list, so any
build without credentials falls back to the sample events and trips in
[`src/data/sampleEvents.js`](src/data/sampleEvents.js) and shows a notice saying
so. Their dates are generated relative to today, so
the upcoming/past split always makes sense. Set `VITE_SAMPLE_DATA=false` to see
the real empty state instead. The live site is built with the real credentials,
the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` repository secrets, and real
credentials always win, so it never shows invented events. If those secrets were
ever removed the build would fall back to the sample events; setting
`VITE_SAMPLE_DATA: 'false'` on the workflow's build step makes it show the real
empty state instead.

To use real data instead, set both values in `.env.local`:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your anon public key>
```

You can find them in your Supabase project under: Project Settings → API →
Project URL and anon public API key. Real credentials always win. A URL that is
not an `http://` or `https://` one, such as a leftover placeholder, counts as not
set, so you get the sample data and not an error. The fixtures and the Supabase
client are each code-split into their own chunk: a build with credentials never
downloads the fixtures, and a build without them never downloads the client.

### 4. Run the Development Server

```bash
npm run dev
```

The website will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

For the real thing — the build plus the prerendered HTML that gets deployed — use:

```bash
npm run build:ssg
```

## npm scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server on `http://localhost:5173` |
| `npm run build` | SPA production build into `dist/` |
| `npm run build:ssg` | `build`, then prerenders all 50 routes to static HTML (this is what the deploy workflow runs) |
| `npm run preview` | Serves the `build` output |
| `npm run preview:ssg` | Serves `dist/` the way GitHub Pages does, so prerendered routes, the 404 fallback and the trailing-slash redirect behave as they will in production |
| `npm run test:ssg` | `build:ssg`, then `preview:ssg`: builds, prerenders and serves the result in one go |
| `npm run lint` | ESLint over the whole repo |
| `npm run smoke` | Browser smoke test — see [Testing](#testing) |
| `npm run images` | Re-encodes `src/assets/images/` to WebP — see below |
| `node scripts/generate-og-image.js` | Redraws the social sharing card at `public/og-image.jpg` — see [SEO assets](#seo-assets) |

### How the static build works

`npm run build:ssg` runs `vite build`, then `scripts/prerender.js`. The script serves
`dist/` locally, opens every route in headless Chrome and saves the rendered HTML: the
6 pages in each of the 7 languages, a 404 page per language, and the root. It also
writes `dist/sitemap.xml` and the redirect pages for the old URLs, and copies the English
404 page to `dist/404.html`, which GitHub Pages serves for any address it does not know.

The browser it renders in is fixed (`en-US`, light theme, Stockholm time zone), so the
saved pages never depend on the machine that built them.

The prerender is strict, so a broken page is never published. The build exits with an
error if Chrome cannot start, or if a route does not render as its own page: the right
`<h1>`, `<html lang>` and canonical URL, no error screen and no uncaught page error. A
build **with** Supabase credentials also needs Supabase to answer. If a page's events
never arrive (a paused project, say) the build fails with a message naming the route,
instead of saving a page full of loading placeholders.

### Deploying somewhere other than the domain root

The live site is served from the root of `esnskovde.org`, but a GitHub *project*
page is served from `/<repo>/`. Building with the wrong one gives a blank page —
every asset URL points at the wrong place.

`BASE_PATH` controls it, and `scripts/serve-static.js --base` reproduces the
layout locally so you can check before deploying:

```bash
BASE_PATH=/my-repo npm run build:ssg && node scripts/serve-static.js --base /my-repo
```

The shipped deploy workflow does not set `BASE_PATH`, so it builds for the domain
root, which is what esnskovde.org needs. To deploy a project page (a fork, say),
set `BASE_PATH: /<repo>` on the workflow's build step. `actions/configure-pages`
can fill it in: it strips the trailing slash, reporting an empty string at a
domain root and `/<repo>` for a project page, and the build reads an empty
`BASE_PATH` as `/`.

A non-root deploy is treated as a preview, and every one of its pages carries
`<meta name="robots" content="noindex, nofollow">`, while its canonical URLs
still point at esnskovde.org. No robots.txt is involved: crawlers only read the
one at the root of a host, which a project page does not own. Set
`VITE_NOINDEX=true` to mark any other build the same way.

### Images

Images are served as WebP at the widths they are actually rendered at, generated
from the originals in `src/assets/images/` into `src/assets/images/optimized/`.
Both the originals and the generated files are committed, so a normal build needs
nothing extra.

If you add or replace an image, drop the original into `src/assets/images/`, add a
rule for it in [`scripts/optimize-images.js`](scripts/optimize-images.js) (the rule
sets the output widths and quality — pick widths from how the image is laid out, not
from the source file), then run:

```bash
npm run images
```

Commit the generated files alongside the original. Referencing images from code goes
through `getImage()` in `src/lib/images.js`, which returns the `src` and `srcSet` for
a name — do not import files from `optimized/` directly.

### Board members

`src/data/boardMembers.json` is written in plain English and stays that way: a country
such as `"India"`, languages such as `["Swedish", "English"]`, a join date such as
`"May 2026"` and a mascot day such as `"March 16, 2025"`. In the other six languages the
board page shows these in the reader's language, working them out from the English
text (`src/lib/boardFacts.js`). Anything it does not recognise, such as a country or
language the browser has no name for or a date written some other way, shows exactly as
typed, so a new entry only has to look like the others.

## 📁 Project Structure

```
docs/                  # REVAMP_PLAN.md, the proposal this version was built from
public/                # Served as-is: fonts/ (Kelson Sans), favicon, logo.png,
                       #   og-image.jpg, robots.txt, 404.html
scripts/               # prerender, smoke test, static server, image and share-card tools
src/
├── components/        # Reusable React components
│   ├── board/         # Board member components
│   ├── contact/       # Contact form components
│   ├── events/        # Event-related components
│   ├── esn-card/      # ESNcard page components
│   ├── home/          # Homepage components
│   ├── layout/        # Nav, footer, page shell
│   ├── new-to-skovde/ # New to Skövde guide sections
│   ├── ui/            # Design-system primitives (Button, Card, Reveal, …)
│   ├── SEO.jsx        # Per-page title, description and canonical tags
│   ├── ThemeProvider.jsx  # Light, dark or system theme
│   └── ThemeToggle.jsx    # The theme button in the nav
├── data/              # Static data (board/footer JSON, sample events)
├── hooks/             # Custom React hooks
├── lib/               # Framework-free helpers (dates, languages, routes, images, supabase, …)
├── locales/           # Translation files
│   ├── en/           # English translations
│   ├── sv/           # Swedish translations
│   └── ...           # Other languages
├── pages/             # Page components
└── assets/            # Images and static assets
```

Design tokens (colours, surfaces, the per-page signal colour) live as CSS custom
properties at the top of `src/index.css` and are wired into `tailwind.config.js`, so
the whole site re-themes from one file. Kelson Sans is self-hosted from
`public/fonts/`; Lato comes from Google Fonts.

## Supabase setup (for contributors)

This project reads public data from Supabase. If you want real data locally, create the following tables in your Supabase project and insert a few rows.

### 1) Create tables

Run this SQL in the Supabase SQL editor:

```sql
-- Events shown in Upcoming/Past Events
create table public.events (
  id text not null,
  created_at timestamp with time zone not null default now(),
  title text not null,
  subtitle text null,
  datetime timestamp with time zone not null,
  location text not null,
  "ticketPurchaseLink" text null,
  thumbnail text null,
  "imageCredit" text null,
  constraint events_pkey primary key (id)
);

-- Trips used by the homepage carousel
create table public.trips (
  id text not null,
  created_at timestamp with time zone not null default now(),
  title text null,
  subtitle text null,
  "startsAt" timestamp with time zone null,
  "endsAt" timestamp with time zone null,
  location text null,
  thumbnail text null,
  "detailsLink" text null,
  "imageCredit" text null,
  constraint trips_pkey primary key (id)
);

-- Make both tables readable by anonymous (public) clients
alter table public.events enable row level security;
alter table public.trips enable row level security;

create policy "Public read events" on public.events
  for select using (true);

create policy "Public read trips" on public.trips
  for select using (true);
```

Notes:
- The app only performs `select` queries. The above RLS policies allow public read access.
- If you already use different column names, align them with what the code expects or adjust the code accordingly.

### 2) Optional: sample data

Insert a couple of rows to see data in the UI:

```sql
-- Events sample rows (note: camelCase columns must be quoted)
insert into public.events ("id", "title", "subtitle", "datetime", "location", "ticketPurchaseLink", "thumbnail", "imageCredit")
values
  ('ev-001', 'Meeple Monday', 'A cosy board game night happening every Monday - the perfect way to meet new people and have fun.', now() + interval '7 days', 'Kungsgatan 17', null, 'https://example.com/meeple.jpg', null),
  ('ev-002', 'Karaoke Night', 'Sing, laugh, and enjoy the fun at Rådhuscaféet - everyone’s welcome, from shower singers to superstars!', now() + interval '10 days', 'Rådhuscaféet', null, 'https://example.com/karoake.jpg', null);

-- Trips sample rows (must include id; camelCase columns must be quoted)
insert into public.trips ("id", "title", "subtitle", "location", "startsAt", "endsAt", "thumbnail", "detailsLink", "imageCredit")
values
  ('tr-001', 'Stockholm Weekend', 'City tour and museums', 'Stockholm', now() + interval '20 days', now() + interval '22 days', 'https://example.com/stockholm.jpg', 'https://example.com/details', null),
  ('tr-002', 'Lake Vänern Day Trip', 'Nature and picnic', 'Vänern', now() - interval '10 days', now() - interval '9 days', 'https://example.com/vanern.jpg', null, null);
```

After inserting, restart the dev server if it was already running so environment changes are picked up.

## Contributing

We welcome contributions from the community! Here's how you can help:

### Reporting Issues

1. Check if the issue already exists in the [Issues](https://github.com/your-username/esn-skovde-website/issues) section
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)

### Making Contributions

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**:
   - Follow the existing code style
   - Add comments for complex logic
   - Test your changes thoroughly
4. **Commit your changes**:
   ```bash
   git commit -m "Add: brief description of your changes"
   ```
5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request** with a clear description of your changes

### Translation Contributions

Help us make the website accessible to more students by contributing translations:

1. Navigate to `src/locales/[language]/translation.json`
2. Add or update translations for missing keys
3. Follow the existing JSON structure
4. Test the translations in the development environment

English is bundled with the app and is the fallback: a key missing from another
language shows in English. Each of the other languages is a chunk of its own that
`loadLanguage()` in `src/i18n.js` fetches when a visitor opens it.

A new key has to be added to all seven files, with a real translation in each, not
an English copy. The files are plain JSON indented with four spaces and end with a
newline. French has one key the others do not, `events.inDays_many`, because French
has a plural form that the other languages lack.

To **add a language**:

1. Copy `src/locales/en/translation.json` to `src/locales/<code>/translation.json`
   and translate it. The file is found and loaded on demand automatically.
2. Add `{ code, name, flag }` to `SUPPORTED_LANGUAGES` in `src/lib/languages.js`. The
   routes, the language pickers, the footer links, hreflang, the sitemap and the
   prerender all follow from that list.
3. Add its `og:locale` (for example `pl_PL`) to `OG_LOCALE` in `src/components/SEO.jsx`.
4. Add the code to the language list in `scripts/smoke.js`.

**Languages we support:**
- 🇸🇪 Swedish (sv)
- 🇬🇧 English (en)
- 🇩🇪 German (de)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇮🇹 Italian (it)
- 🇳🇴 Norwegian (no)

### Design Contributions

- **UI/UX Improvements**: Suggest better user experience designs
- **Accessibility**: Help improve accessibility features
- **Mobile Responsiveness**: Ensure components work on all devices
- **Performance**: Optimize loading times and user experience

### Testing

Before submitting your changes:

1. **Run the linter**:
   ```bash
   npm run lint
   ```
2. **Run the smoke test**. With the dev server already running in another terminal:
   ```bash
   npm run smoke
   ```
   It loads every route in a headless browser on a desktop window in both themes, and
   on emulated tablets (834 and 768px wide) and phones (390 and 320px) that honour the
   viewport meta as real devices do.
   It fails on things a build cannot see: console and runtime errors, failed
   requests, broken images, sideways page scroll, a tablet or phone layout that is
   not the device's width (a missing or broken viewport meta), scroll-reveals that
   never fired, a page with no `<h1>`, and an app that shows the route spinner or
   empties `<main>` while it takes over the prerendered page. It checks English by default;
   add `-- --all` for all seven languages, or `-- --base http://localhost:4173` to run
   it against a built site instead of the dev server. `-- --all` is 294 checks (7
   languages × 7 routes × 6 device and theme combinations) and takes about ten minutes
   on an idle machine. Run it on a quiet one: the scroll-reveal check can fail
   spuriously when the machine is busy. If Puppeteer cannot find its Chrome, set
   `PUPPETEER_EXECUTABLE_PATH` to an installed one.
3. **Test in different browsers** (Chrome, Firefox, Safari, Edge)
4. **Test responsive design** on different screen sizes
5. **Test accessibility** with screen readers
6. **Test all language versions**

## Development Guidelines

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### Things to keep in mind

- **Links.** Every page URL ends in a slash. Build internal links with
  `useLang().path("events")`, never a hard-coded `/en/events`.
- **Text.** Every visible string, including `aria-label`s and image descriptions, goes
  through `t()`.
- **Dates.** Event times belong to Skövde. Format them with `src/lib/dates.js`, which
  pins `Europe/Stockholm`, and not with `toLocaleString`.
- **Colours.** The tokens in `src/index.css` are tuned so text keeps 4.5:1 contrast on
  every surface in both themes (the faint ink, the signal inks, the glass header).
  Re-measure after changing one, and do not fade cards with opacity.
- **Phones.** Test with device emulation (Chrome's device mode, or `page.emulate` in
  Puppeteer), not a resized window: only emulation honours the viewport meta.
- **Prerendering.** Code that depends on the current time or on Supabase data has to
  cope with being rendered at build time. `isPrerender` in `src/lib/prerender.js` tells
  it when that is happening.

### Component Structure

```jsx
// Component imports
import React from 'react';
import { useTranslation } from 'react-i18next';

// Component definition
const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default MyComponent;
```

### Translation Keys

Use descriptive translation keys:
```json
{
  "events": {
    "title": "Events",
    "upcoming": "Upcoming Events",
    "past": "Past Events"
  }
}
```

## Deployment

The website is automatically deployed to GitHub Pages when changes are pushed to the main branch.
The build reads two repository secrets, `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
(Settings → Secrets and variables → Actions).

### Manual Deployment

Publishing happens in the **Deploy to GitHub Pages** workflow
(`.github/workflows/deploy.yml`), not from a developer's machine. To publish again
without a new commit, open the repository's **Actions** tab, choose **Deploy to
GitHub Pages** and use **Run workflow** on `main`.

There is no `npm run deploy`. It pushed `dist/` to a `gh-pages` branch, which this
repository's Pages source (GitHub Actions) never serves, and a build made on a
laptop lacks the Supabase secrets the workflow has.

## Support

- **Website Issues**: Create an issue in this repository
- **ESN Skövde Contact**: Visit our [contact page](https://esnskovde.org/contact)
- **General Questions**: Reach out to the development team



## Links

- **Website**: [https://esnskovde.org/](https://esnskovde.org/)
- **ESN Sweden**: [https://esnsweden.org/](https://esnsweden.org/)
- **ESN International**: [https://esn.org/](https://esn.org/)

---

**Made with ❤️ by ESN Skövde for international students**
