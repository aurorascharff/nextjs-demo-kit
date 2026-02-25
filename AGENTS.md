# AGENTS.md

## Commands

```bash
bun install
bun run dev          # http://localhost:3000
bun run build        # run before committing
bun run lint         # run before committing
```

```bash
bun run prisma.push      # push schema to DB
bun run prisma.seed      # seed database
bun run prisma.studio    # open Prisma Studio
bun run prisma.migrate   # run migrations
bun run prisma.generate  # generate Prisma client
```

## Stack

Next.js 16 App Router · React 19 · TypeScript strict · Tailwind CSS 4 · shadcn/ui · Base UI · Prisma · nuqs · SWR · Zod · Sonner · next-themes · sugar-high

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
  slides/               # Slide deck system
    _components/        # Slide primitives (primitives.tsx, SlideLink.tsx)
    [page]/page.tsx     # Dynamic route per slide
    layout.tsx          # Client layout — navigation, ViewTransition
    slides.tsx          # Slide registry
    page.tsx            # Redirects /slides → /slides/1
components/
  ui/                   # shadcn/ui primitives (add: bunx shadcn@latest add <name>)
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

## Data Fetching & Mutations

**Queries** live in `data/queries/`. Wrap with `React.cache()` for deduplication. Await directly in Server Components. Only pass the promise unawaited if a client component needs to unwrap it with `use()`.

```ts
// data/queries/posts.ts
import { cache } from 'react';
export const getPosts = cache(async () => {
  return db.post.findMany();
});
```

```tsx
// Server Component — just await
const posts = await getPosts();

// If a client component needs it, pass the promise instead
const postsPromise = getPosts();
return <PostList postsPromise={postsPromise} />;
// then in the client component: const posts = use(postsPromise);
```

**Mutations** live in `data/actions/` with `"use server"`. Invalidate with `revalidateTag()` or `revalidatePath()` after mutating. Always call from within a transition for pending state.

```ts
// data/actions/posts.ts
'use server';
export async function deletePostAction(id: string) {
  await db.post.delete({ where: { id } });
  revalidateTag('posts');
}
```

```tsx
// Usage
startTransition(async () => {
  await deletePostAction(id);
});
```

Tag queries with `cacheTag()` and match with `revalidateTag()` for fine-grained invalidation. Use `revalidatePath()` for simpler cases.

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

Use `exit`/`enter` class props with CSS `::view-transition-old`/`::view-transition-new` selectors for custom animations. Use `addTransitionType()` inside `startTransition` for directional or contextual transitions:

```tsx
startTransition(() => {
  addTransitionType(index > current ? 'slide-forward' : 'slide-back');
  router.push(nextUrl);
});
```

```tsx
<ViewTransition
  enter={{ default: 'slide-from-right', 'slide-back': 'slide-from-left' }}
  exit={{ default: 'slide-to-left', 'slide-back': 'slide-to-right' }}
>
  <div>{children}</div>
</ViewTransition>
```

## Slide Deck System

A composable presentation system using URL-based routing, ViewTransitions, and sugar-high syntax highlighting.

**Architecture:** Each slide maps to a URL (`/slides/1`, `/slides/2`, …). The layout handles navigation (keyboard, click, progress dots) and ViewTransition animations. Slides are composed from server component primitives.

**Key files:**

- `app/slides/slides.tsx` — Slide registry. Add/remove/reorder slides here.
- `app/slides/layout.tsx` — Client layout with navigation logic and ViewTransition wrappers.
- `app/slides/_components/Slide.tsx` — All server-side slide primitives.
- `app/slides/_components/SlideLink.tsx` — Server component for styled links inside slides.

**Adding a slide:** Add a `<Slide>` element to the `slides` array in `app/slides/slides.tsx`. Compose with any combination of the primitives above. The layout and routing handle everything else automatically.

**Interactive components:** Wrap components in `<SlideDemo>` to embed interactive content. The `data-slide-interactive` attribute prevents click/keyboard navigation from interfering. Any `"use client"` component can be dropped into a slide — import it in `slides.tsx` and place it inside `<SlideDemo>`.

```tsx
<Slide>
  <SlideDemo label="Live demo">
    <MyComponent />
  </SlideDemo>
</Slide>
```

**Links:** Use `<SlideLink href="/slides/3">` inside slides to jump to a specific slide. Use `<SlideLink href="/">` to leave the deck. From outside the deck, link in with `<Link href="/slides/1">`. Links animate automatically via ViewTransition.

**Animations:** Slide-to-slide transitions use the ViewTransition component — links animate automatically. The layout uses `addTransitionType('slide-forward' | 'slide-back')` only for keyboard/click navigation direction. All animation CSS is in `globals.css` using `::view-transition-old`/`::view-transition-new` selectors.

**Code theme:** sugar-high uses `--sh-*` CSS variables defined in `globals.css` (light and dark variants). Code block colors use Tailwind theme tokens: `bg-code-bg`, `border-code-border`, `text-code-text`.

## Error Handling

- `error.tsx` — error boundaries
- `not-found.tsx` + `notFound()` — 404s
- `unauthorized.tsx` + `unauthorized()` — auth errors
- `toast.success()` / `toast.error()` from Sonner for user feedback
- Errors inside transitions bubble to error boundaries automatically — no try/catch needed