# Next.js Starter

A [Next.js 16](https://nextjs.org/) starter with [Prisma](https://www.prisma.io/), [Tailwind CSS](https://tailwindcss.com/), and [shadcn/ui](https://ui.shadcn.com/) (built on [Base UI](https://base-ui.com/)), with modern patterns for building demos and applications.

Uses [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) for static shell rendering and modern [Async React](https://async-react.dev/) patterns for declarative async coordination.

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
- **components/design** — Components that expose [Action props](https://react.dev/reference/react/useTransition#exposing-action-props-from-components) and handle optimistic state and transitions internally

Every page folder should contain everything it needs. Components and functions live at the nearest shared space in the hierarchy.

**Naming:** PascalCase for components, kebab-case for files/folders, camelCase for functions/hooks. Suffix transition-based functions with "Action".

## Development Flow

- **Fetching data** — Queries in `data/queries/`, wrapped with `cache()`. Pass promises to client components and unwrap with `use()`. Client components use SWR for interactive fetches.
- **Mutating data** — Server Actions in `data/actions/` with `"use server"`. Invalidate with `revalidateTag()` or `revalidatePath()`. Use `useTransition` + `useOptimistic` for pending state and instant feedback.
- **Navigation** — Wrap `router.push()` / param updates in `startTransition` to keep the current page visible while the new route loads.
- **Caching** — Add [`"use cache"`](https://nextjs.org/docs/app/api-reference/directives/use-cache) with `cacheLife()` to pages, components, or functions to include them in the static shell.
- **Errors** — `error.tsx` for boundaries, `not-found.tsx` + `notFound()` for 404s, `unauthorized.tsx` + `unauthorized()` for auth. Errors thrown inside transitions automatically reach the nearest error boundary.

## Key Patterns

**Cache Components & static shell:** With `cacheComponents: true`, Next.js pre-renders a static HTML shell and streams dynamic content in via `<Suspense>`. Keep pages non-async and push dynamic data access (`searchParams`, `cookies()`, `headers()`) into Suspense boundaries as deep as possible.

**Async React:** Replace manual `isLoading`/`isError` state with React 19's coordination primitives — `useTransition` for tracking async work, `useOptimistic` for instant feedback, `Suspense` for loading boundaries, and `use()` for reading promises during render.

Other conventions: suffix transition functions with "Action" (`submitAction`, `changeAction`); design components in `components/design/` handle transitions and optimistic updates internally; co-locate skeleton fallbacks with their component. See `AGENTS.md` for detailed patterns and examples.

## Development Tools

Uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) with format-on-save in VS Code. Configuration in `eslint.config.mjs` and `.prettierrc`. Open the `.code-workspace` file to ensure correct extensions are set.

## Deployment

```bash
bun run build
```

Deploy to [Vercel](https://vercel.com) for the easiest experience. Use a production database instead of SQLite.

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
