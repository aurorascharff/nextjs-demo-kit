# AGENTS.md

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # run before committing
npm run lint         # run before committing
```

```bash
npm run prisma.push      # push schema to DB
npm run prisma.seed      # seed database
npm run prisma.studio    # open Prisma Studio
npm run prisma.migrate   # run migrations
npm run prisma.generate  # generate Prisma client
```

## Stack

Next.js 16 App Router · React 19 · TypeScript strict · Tailwind CSS 4 · shadcn/ui · Base UI · Prisma · nuqs · SWR · Zod · Sonner · next-themes

## Next.js 16 APIs (not in training data)

- `cookies()` / `headers()` — now async, must be awaited
- `forbidden()` / `unauthorized()` — throw from Server Components to trigger `forbidden.tsx` / `unauthorized.tsx`
- `connection()` — opt into dynamic rendering
- `'use cache'` + `cacheLife()` + `cacheTag()` — caching directive
- `revalidateTag()` — invalidate cache tags
- `after()` — run code after response is sent

## Typed Routes

`typedRoutes: true` generates `.next/types/routes.d.ts`. Use framework types instead of custom ones:

- Pages: `PageProps<'/'>` — `params` and `searchParams` are promises
- Layouts: `LayoutProps<'/'>` — `params` and `children`
- Route handlers: `RouteContext<'/api/...'>`

## Folder Structure

```
app/                    # File-based routing
  [slug]/
  dashboard/
    _components/        # Route-local components
components/
  ui/                   # shadcn/ui primitives (add: npx shadcn@latest add <name>)
  design/               # Design system — Action props pattern (see below)
data/
  queries/              # Server-side data fetching, wrapped with cache()
  actions/              # Server Functions ("use server")
lib/                    # Utils, searchParam definitions
prisma/
```

## Code Style

- Components: `PascalCase.tsx` · Folders: `kebab-case/` · Utils/hooks: `camelCase.ts`
- `type` over `interface` unless declaration merging needed
- `cn()` from `lib/utils.ts` for conditional Tailwind classes
- Use Base UI for interactive components not covered by shadcn/ui

## cacheComponents & Static Shell

`cacheComponents: true` in `next.config.ts` caches server components that don't access dynamic data. To maximize the static shell:

- Keep pages **non-async**. Push `searchParams`, `cookies()`, `headers()` into async server components inside `<Suspense>`.
- Start fetches without awaiting, pass the promise to client components, unwrap with `use()`.

## Async React Patterns

Replace manual `isLoading`/`isError` state with React 19 primitives:

**Actions** — any async function run inside `startTransition`. React tracks `isPending` automatically; unexpected errors bubble to error boundaries. Suffix with "Action" (`submitAction`, `deleteAction`, `changeAction`) to signal transition context.

```tsx
const [isPending, startTransition] = useTransition();
function submitAction() {
  startTransition(async () => { await submitToServer(); });
}
```

`<form action={fn}>` also wraps in a transition automatically. Use `useFormStatus` for child pending state, `useActionState` for action results.

**Optimistic updates** — `useOptimistic` updates immediately inside a transition, reverts automatically on failure.

```tsx
const [optimisticDone, setOptimisticDone] = useOptimistic(done);
startTransition(async () => {
  setOptimisticDone(true);
  await markDone();
});
```

**Suspense** — declare loading boundaries. Suspense shows the fallback on first load; subsequent updates keep old content visible automatically. Wrap `<Suspense>` with a co-located skeleton whenever accessing dynamic data.

**`use()`** — unwrap promises in client components during render. Suspends until resolved; errors go to the nearest error boundary. The promise must come from a framework-managed source (Server Component or `cache()`-wrapped query) so it's stable across renders.

```tsx
const data = use(dataPromise);
```

**`useDeferredValue`** — keep inputs responsive during rapid updates; show staleness with opacity.

## Design Components (Action Props Pattern)

Components in `components/design/` handle coordination internally and expose Action props to consumers. Prefer this over scattering `useTransition` / `useOptimistic` in page code.

```tsx
// Consumer
<Design.SearchInput value={search} changeAction={searchAction} />
<Design.TabList activeTab={tab} changeAction={tabAction} />
<Design.CompleteButton complete={item.complete} action={completeAction} />

// Inside a design component
function SearchInput({ value, changeAction }) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const [isPending, startTransition] = useTransition();
  function handleChange(e) {
    startTransition(async () => {
      setOptimisticValue(e.target.value);
      await changeAction(e.target.value);
    });
  }
  return (
    <div className="relative">
      <input value={optimisticValue} onChange={handleChange} />
      {isPending && <Spinner />}
    </div>
  );
}
```

## Pending UI

Set `data-pending={isPending ? '' : undefined}` on a root element. Style ancestors with `has-data-pending:animate-pulse` or `group-has-data-pending:animate-pulse`.

## URL State

Use nuqs (`useQueryState` + `createSearchParamsCache`). Define parsers in `lib/searchParams.ts`. Always set `shallow: false` and pass `startTransition` as the transition option. Use `createSearchParamsCache` to parse `searchParams` on the server.

## Skeleton Co-location

Export skeleton components from the **same file** as their component, placed below the main export.

## ViewTransition (canary)

Wraps the browser View Transition API; activates on React transition updates. Use for smooth list reordering and content swaps.

```tsx
<ViewTransition key="results">
  {items.map(item => <ViewTransition key={item.id}><Item /></ViewTransition>)}
</ViewTransition>
```

## Error Handling

- `error.tsx` — error boundaries
- `not-found.tsx` + `notFound()` — 404s
- `unauthorized.tsx` + `unauthorized()` — auth errors
- `toast.success()` / `toast.error()` from Sonner for user feedback
- Errors inside transitions bubble to error boundaries automatically — no try/catch needed