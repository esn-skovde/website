# ESN Skövde Website

**Live Website**: [https://esnskovde.org/](https://esnskovde.org/)

A multilingual website for ESN Skövde (Erasmus Student Network) built with React, featuring events, trips, board information, and resources for international students in Skövde, Sweden.

# How to contribute?

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm or yarn
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/esn-skovde-website.git
cd esn-skovde-website
```

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

### 4. Run the Development Server

```bash
npm run dev
```

The website will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── board/         # Board member components
│   ├── common/        # Shared components
│   ├── contact/       # Contact form components
│   ├── events/        # Event-related components
│   ├── home/          # Homepage components
│   └── new-to-skovde/   # New to Skövde resources
├── data/              # Static data files (JSON)
├── hooks/             # Custom React hooks
├── locales/           # Translation files
│   ├── en/           # English translations
│   ├── sv/           # Swedish translations
│   └── ...           # Other languages
├── pages/             # Page components
├── utils/             # Utility functions
└── assets/            # Images and static assets
```

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
2. **Test in different browsers** (Chrome, Firefox, Safari, Edge)
3. **Test responsive design** on different screen sizes
4. **Test accessibility** with screen readers
5. **Test all language versions**

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
npm run build
npm run deploy
```

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
