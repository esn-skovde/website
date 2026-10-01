# ESN Skövde Website

**Live Website**: [https://esnskovde.org/](https://esnskovde.org/)

A multilingual website for ESN Skövde (Erasmus Student Network) built with React 19, Vite and Tailwind CSS, featuring events, trips, board information, and resources for international students in Skövde, Sweden.

It ships as a static site: Vite builds the SPA, then a prerender step renders every route in a headless browser so each of the 7 languages × 6 pages has real HTML for crawlers and for the first paint.

# How to contribute?

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
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

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the sample environment file and fill it with your Supabase project credentials:

```bash
cp .env.sample .env.local
```

Then edit `.env.local` and set:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project under: Project Settings → API → Project URL and anon public API key.

**You can skip this step.** Without credentials the Events page has nothing to
list, so any build without credentials falls back to the sample events and trips
in [`src/data/sampleEvents.js`](src/data/sampleEvents.js) and shows a notice
saying so — deployed previews included. Their dates are generated relative to
today, so the upcoming/past split always makes sense. Set `VITE_SAMPLE_DATA=false`
to see the real empty state instead; the deploy workflow sets exactly that for a
root deploy, so the live site never shows invented events. Real credentials always
win, and the fixtures are code-split into their own chunk, so a build that has
credentials never downloads them.

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
| `npm run build:ssg` | `build`, then prerenders all 50 routes to static HTML (this is what `deploy` runs) |
| `npm run preview` | Serves the `build` output |
| `npm run preview:ssg` | Serves `dist/` the way GitHub Pages does, so prerendered routes, the 404 fallback and the trailing-slash redirect behave as they will in production |
| `npm run lint` | ESLint over the whole repo |
| `npm run smoke` | Browser smoke test — see [Testing](#testing) |
| `npm run images` | Re-encodes `src/assets/images/` to WebP — see below |
| `node scripts/generate-og-image.js` | Redraws the social sharing card at `public/og-image.jpg` — see [SEO assets](#seo-assets) |
| `npm run deploy` | `build:ssg`, then publishes `dist/` to GitHub Pages |

### Deploying somewhere other than the domain root

The live site is served from the root of `esnskovde.org`, but a GitHub *project*
page is served from `/<repo>/`. Building with the wrong one gives a blank page —
every asset URL points at the wrong place.

`BASE_PATH` controls it, and `scripts/serve-static.js --base` reproduces the
layout locally so you can check before deploying:

```bash
BASE_PATH=/my-repo npm run build:ssg && node scripts/serve-static.js --base /my-repo
```

The deploy workflow fills `BASE_PATH` from `actions/configure-pages`, which
strips the trailing slash: it reports an empty string at a domain root, custom
domains such as esnskovde.org included, and `/<repo>` for a project page. The
build reads an empty `BASE_PATH` as `/`, so neither production nor a fork needs
editing.

A non-root deploy is treated as a preview, and every one of its pages carries
`<meta name="robots" content="noindex, nofollow">`, while its canonical URLs
still point at esnskovde.org. No robots.txt is involved: crawlers only read the
one at the root of a host, which a project page does not own. Set
`VITE_NOINDEX=true` to mark any other build the same way.

Only the repository's **default branch** deploys: `main` here, and whichever
branch a fork has made its default. Every run lints and builds, so a push to any
other listed branch or a manual run from any other branch is a build-only check,
and so is every pull request to `main`.

One catch when previewing on a fork: besides being the fork's default branch,
the branch has to be allowed by the fork's `github-pages` environment (Settings →
Environments → github-pages). Renaming a branch does not update that rule.

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

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── board/         # Board member components
│   ├── common/        # Shared components
│   ├── contact/       # Contact form components
│   ├── events/        # Event-related components
│   ├── esn-card/      # ESNcard page components
│   ├── home/          # Homepage components
│   ├── layout/        # Nav, footer, page shell
│   ├── new-to-skovde/ # New to Skövde guide sections
│   └── ui/            # Design-system primitives (Button, Card, Reveal, …)
├── data/              # Static data (board/footer JSON, sample events)
├── hooks/             # Custom React hooks
├── lib/               # Framework-free helpers (dates, images, supabase, …)
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
   It loads every route in a headless browser at desktop, tablet and mobile widths in
   both themes, and fails on things a build cannot see: console and runtime errors,
   failed requests, broken images, sideways page scroll, scroll-reveals that never
   fired, a page with no `<h1>`, and an app that shows the route spinner or empties
   `<main>` while it takes over the prerendered page. It checks English by default;
   add `-- --all` for all seven languages, or `-- --base http://localhost:4173` to run
   it against a built site instead of the dev server.
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

### Manual Deployment

```bash
npm run deploy
```

`deploy` runs `build:ssg` first via `predeploy`, so there is no need to build separately.

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
