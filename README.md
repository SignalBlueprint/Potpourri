# Potpourri

A lightweight gift shop client built with Vite + React + TypeScript + TanStack Router + TanStack Query + Tailwind CSS.

## How to run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── main.tsx           # App entry with providers (QueryClient, Router)
├── app.tsx            # Router setup and root layout
├── client.config.ts   # Branding, tenant config, and feature flags
├── styles.css         # Tailwind CSS imports
└── routes/
    ├── index.tsx      # Home page (/)
    ├── catalog.tsx    # Catalog page (/catalog)
    ├── item.tsx       # Item detail page (/item/:id)
    └── admin.tsx      # Admin panel (/admin)
```

## Configuration

Edit `src/client.config.ts` to customize:
- **Branding**: Shop name, tagline, colors, logo
- **Tenant**: API base URL and tenant ID
- **Feature flags**: Toggle cart, wishlist, reviews, admin panel
