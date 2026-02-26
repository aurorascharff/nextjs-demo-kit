# Next.js Demo Kit

A demo toolkit built with [Next.js 16](https://nextjs.org/), [React 19](https://react.dev/), [Prisma](https://www.prisma.io/), [Tailwind CSS](https://tailwindcss.com/), and [shadcn/ui](https://ui.shadcn.com/) (built on [Base UI](https://base-ui.com/)). Includes a component showcase, a slide deck powered by [`nextjs-slides`](https://www.npmjs.com/package/nextjs-slides), and modern patterns for building interactive demos.

Uses [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) for performance and modern [Async React](https://async-react.dev/) patterns for declarative async coordination.

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Prisma Setup

This project uses SQLite with a local database file (`dev.db`). No environment configuration needed.

```bash
bun run prisma.generate   # Generate the Prisma client
bun run prisma.push       # Push schema to database
bun run prisma.seed       # Seed initial data
bun run prisma.studio     # View data in Prisma Studio
```

**Using Prisma Postgres instead:** Change the provider in `prisma/schema.prisma` to `postgresql`, update `db.ts` to use `@prisma/adapter-pg`, and set your connection string in `.env`:

```env
DATABASE_URL="postgres://..."
```

## Project Structure

```plaintext
app/                      # Pages and layouts
  _components/            # Route-local components
  slides/                 # Slide deck (uses nextjs-slides package)
components/
  design/                 # Design system components with Action props
  ui/                     # shadcn/ui primitives
data/
  actions/                # Server Actions
  queries/                # Data fetching with cache()
lib/
  fetcher.ts              # Shared SWR fetcher
```

- **components/ui** — [shadcn/ui](https://ui.shadcn.com/) components. Add with `bunx shadcn@latest add <component-name>`
- **components/design** — Components that expose [Action props](https://react.dev/reference/react/useTransition#exposing-action-props-from-components) and handle async coordination internally
Every page folder should contain everything it needs. Components and functions live at the nearest shared space in the hierarchy.

**Naming:** PascalCase for components, kebab-case for files/folders, camelCase for functions/hooks. Suffix transition-based functions with "Action".

## Development Flow

- **Fetching data** — Queries in `data/queries/`, wrapped with `cache()`. Await in Server Components directly, or pass the promise to a client component and unwrap with `use()`. Use SWR with `lib/fetcher.ts` for dependent or interactive client-side fetches (e.g. cascading filter options).
- **Mutating data** — Server Actions in `data/actions/` with `"use server"`. Invalidate with `revalidateTag()`. Use `useTransition` + `useOptimistic` for pending state and instant feedback.
- **Navigation** — Wrap route changes in `useTransition` to get `isPending` for loading UI.
- **Caching** — Add `"use cache"` with `cacheLife()` to pages, components, or functions to include them in the static shell.
- **Errors** — `error.tsx` for boundaries, `not-found.tsx` + `notFound()` for 404s. Errors thrown inside transitions automatically reach the nearest error boundary.

## Key Patterns

**Cache Components:** Uses [`cacheComponents: true`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) to statically render server components that don't access dynamic data. Keep pages non-async and push dynamic data access into `<Suspense>` boundaries to maximize the static shell. Use [`"use cache"`](https://nextjs.org/docs/app/api-reference/directives/use-cache) with `cacheLife()` to explicitly cache additional components or functions.

**Async React:** Replace manual `isLoading`/`isError` state with React 19's coordination primitives — `useTransition` for tracking async work, `useOptimistic` for instant feedback, `Suspense` for loading boundaries, and `use()` for reading promises during render. See `AGENTS.md` for detailed patterns and examples.

## Development Tools

Uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) with format-on-save in VS Code. Configuration in `eslint.config.mjs` and `.prettierrc`. Open the `.code-workspace` file to ensure correct extensions are set.

## Deployment

```bash
bun run build
```

Deploy to [Vercel](https://vercel.com) for the easiest experience. Use a production database instead of SQLite.

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Slide Deck

Uses [`nextjs-slides`](https://www.npmjs.com/package/nextjs-slides) for composable presentations at `/slides`. Add slides by composing primitives in `app/slides/slides.tsx`. See the [package documentation](https://www.npmjs.com/package/nextjs-slides) for available primitives and props.
