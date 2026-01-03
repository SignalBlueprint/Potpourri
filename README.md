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

## Scripts

```bash
npm run lint        # Run ESLint
npm run format      # Check Prettier formatting
npm run format:fix  # Fix Prettier formatting
npm run typecheck   # Run TypeScript type checking
npm run test        # Run tests with Vitest
npm run build       # Build for production
```

## Configuration

Edit `src/client.config.ts` to customize:

- **Branding**: Shop name, tagline, colors, logo
- **Tenant**: API base URL and tenant ID
- **Feature flags**: Toggle cart, wishlist, reviews, admin panel

## CI/CD

### Continuous Integration

The CI workflow (`.github/workflows/ci.yml`) runs on all PRs and pushes to main:

1. Install dependencies
2. Lint (ESLint)
3. Typecheck (TypeScript)
4. Test (Vitest)
5. Build (Vite)

### Auto-merge

PRs can be automatically merged when all conditions are met:

1. CI passes (all checks green)
2. PR has the `automerge` label
3. PR is not a draft

To use auto-merge:

1. Create a PR
2. Add the `automerge` label
3. Once CI passes, the PR will be automatically squash-merged
