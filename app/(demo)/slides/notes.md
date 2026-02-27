Welcome everyone. Build Demos Fast — a toolkit for interactive demos with React 19, Next.js 16, and modern patterns.

---

What's included: Next.js 16, React 19, Tailwind v4, shadcn/ui, Prisma. Walk through the structure — app/, components/design/ for Action props, components/ui/ for shadcn, data/queries/ with cache(), data/actions/ with updateTag or revalidateTag.

---

Action Props — async coordination. Components own useOptimistic and useTransition; consumers pass changeAction. The usage shows useState, tabs config, and the async handler. Try the demo — click a tab to see instant feedback and the pending spinner.

---

Data slide: Queries use 'use cache' with cacheTag; mutations use Server Actions with updateTag for read-your-own-writes. The code shows getPosts and createPostAction side by side.

---

cacheComponents — stable in Next.js 16. Add it to next.config with reactCompiler and typedRoutes. Static shell means server components without dynamic data get cached. Push dynamic data into Suspense boundaries.

---

This deck uses nextjs-slides: composable primitives, ViewTransitions, keyboard nav. Define slides in an array; each slide is a Slide with SlideTitle, SlideCode, etc. Open /notes on your phone to sync presenter notes.

---

Start building. Clone the repo, bun install, bun run dev. Point them to Explore demo and the GitHub link.

---

**Demo 1** — Open /. Show the component showcase: Card, Form, design components. Point out TabList, Select, EditableText in action.

---

**Demo 2** — Open app/(demo)/slides/slides.tsx. Add a slide: import primitives, push a new Slide with key into the array, compose with SlideTitle and SlideCode. Save and refresh.

---

**Demo 3** — components/design/TabList.tsx. Add console.log in handleChange. Show how the Action Props pattern keeps the UI responsive during the async call — optimistic update + pending state.
