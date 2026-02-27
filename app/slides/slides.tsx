import {
  Slide,
  SlideBadge,
  SlideCode,
  SlideDemo,
  SlideHeaderBadge,
  SlideLink,
  SlideNote,
  SlideSpeaker,
  SlideSpeakerGrid,
  SlideSplitLayout,
  SlideStatement,
  SlideStatementList,
  SlideSubtitle,
  SlideTitle,
} from 'nextjs-slides';
import { TabListDemo } from '@/app/slides/_components/TabListDemo';

export const slides: React.ReactNode[] = [
  // 1. Title slide
  <Slide key="title" align="left">
    <SlideHeaderBadge>Next.js Demo Kit</SlideHeaderBadge>
    <SlideTitle className="font-pixel">Build Demos Fast</SlideTitle>
    <SlideSubtitle>A toolkit for building interactive demos with modern React patterns</SlideSubtitle>
    <SlideSpeakerGrid className="mt-8">
      <SlideSpeaker name="Your Name" title="Your Title" />
    </SlideSpeakerGrid>
  </Slide>,

  // 2. Stack
  <SlideSplitLayout
    key="stack"
    left={
      <>
        <SlideBadge>Stack</SlideBadge>
        <SlideTitle className="mt-6 text-3xl sm:text-4xl md:text-5xl">Modern foundations</SlideTitle>
        <SlideSubtitle className="mt-4">Everything you need to build production-ready demos</SlideSubtitle>
      </>
    }
    right={
      <SlideStatementList>
        <SlideStatement title="Next.js 16" description="App Router with cacheComponents" />
        <SlideStatement title="React 19" description="Actions, useOptimistic, use()" />
        <SlideStatement title="Tailwind CSS v4" description="CSS-first configuration" />
        <SlideStatement title="shadcn/ui" description="Copy-paste components on Base UI" />
        <SlideStatement title="Prisma ORM" description="Type-safe database access" />
      </SlideStatementList>
    }
  />,

  // 3. Async React
  <Slide key="async-react">
    <SlideBadge>Async React</SlideBadge>
    <SlideTitle className="text-3xl sm:text-4xl md:text-5xl">No more isLoading state</SlideTitle>
    <SlideSubtitle>React 19 primitives handle async coordination for you</SlideSubtitle>
    <SlideCode title="async-comparison.tsx">{`// Before: manual state management
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

// After: React handles it
const [isPending, startTransition] = useTransition();
startTransition(async () => {
  await submitToServer();
});`}</SlideCode>
  </Slide>,

  // 4. Action Props Pattern
  <Slide key="action-props">
    <SlideBadge>Design Pattern</SlideBadge>
    <SlideTitle className="text-3xl sm:text-4xl md:text-5xl">Action Props</SlideTitle>
    <SlideSubtitle>Components handle their own async coordination</SlideSubtitle>
    <SlideCode title="components/design/TabList.tsx">{`function TabList({ tabs, activeTab, changeAction }) {
  const [optimisticTab, setOptimisticTab] = useOptimistic(activeTab);
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    startTransition(async () => {
      setOptimisticTab(value);  // Instant feedback
      await changeAction(value); // Server update
    });
  }
  // ...
}`}</SlideCode>
  </Slide>,

  // 5. Live demo
  <SlideSplitLayout
    key="demo"
    left={
      <>
        <SlideBadge>Live Demo</SlideBadge>
        <SlideTitle className="mt-6 text-3xl sm:text-4xl md:text-5xl">Try it</SlideTitle>
        <SlideSubtitle className="mt-4">Click a tab — notice instant feedback + pending spinner</SlideSubtitle>
        <SlideDemo label="TabList component" className="mt-6">
          <TabListDemo />
        </SlideDemo>
      </>
    }
    right={
      <SlideCode title="usage.tsx">{`<TabList
  tabs={[
    { label: 'Overview', value: 'overview' },
    { label: 'Analytics', value: 'analytics' },
    { label: 'Settings', value: 'settings' },
  ]}
  activeTab={activeTab}
  changeAction={async (value) => {
    await updateTab(value);
    setActiveTab(value);
  }}
/>`}</SlideCode>
    }
  />,

  // 6. Data fetching
  <SlideSplitLayout
    key="data-fetching"
    left={
      <>
        <SlideBadge>Data</SlideBadge>
        <SlideTitle className="mt-6 text-3xl sm:text-4xl md:text-5xl">Fetching &amp; mutations</SlideTitle>
        <SlideSubtitle className="mt-4">Queries with cache(), mutations with Server Actions</SlideSubtitle>
      </>
    }
    right={
      <SlideStatementList>
        <SlideStatement title="data/queries/" description="Wrap with cache() for deduplication" />
        <SlideStatement title="data/actions/" description="Server Actions with 'use server'" />
        <SlideStatement title="revalidateTag()" description="Fine-grained cache invalidation" />
        <SlideStatement title="Suspense" description="Streaming with loading boundaries" />
      </SlideStatementList>
    }
  />,

  // 7. cacheComponents
  <Slide key="cache-components">
    <SlideBadge>Performance</SlideBadge>
    <SlideTitle className="text-3xl sm:text-4xl md:text-5xl">Static shell optimization</SlideTitle>
    <SlideSubtitle>cacheComponents caches server components without dynamic data</SlideSubtitle>
    <SlideCode title="next.config.ts">{`export default {
  experimental: {
    cacheComponents: true,
  },
};

// Keep pages non-async, push dynamic data into Suspense
export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <DynamicContent />
    </Suspense>
  );
}`}</SlideCode>
  </Slide>,

  // 8. Project structure
  <SlideSplitLayout
    key="structure"
    left={
      <>
        <SlideBadge>Structure</SlideBadge>
        <SlideTitle className="mt-6 text-3xl sm:text-4xl md:text-5xl">Organized by purpose</SlideTitle>
        <SlideSubtitle className="mt-4">Everything lives at the nearest shared space</SlideSubtitle>
      </>
    }
    right={
      <SlideStatementList>
        <SlideStatement title="app/" description="Pages, layouts, route-local components" />
        <SlideStatement title="components/ui/" description="shadcn/ui primitives" />
        <SlideStatement title="components/design/" description="Action props components" />
        <SlideStatement title="data/queries/" description="Server-side data fetching" />
        <SlideStatement title="data/actions/" description="Server Actions for mutations" />
      </SlideStatementList>
    }
  />,

  // 9. Slides
  <Slide key="slides">
    <SlideBadge>Presentations</SlideBadge>
    <SlideTitle className="text-3xl sm:text-4xl md:text-5xl">Built-in slide deck</SlideTitle>
    <SlideSubtitle>Powered by nextjs-slides — composable primitives with ViewTransitions</SlideSubtitle>
    <SlideCode title="app/slides/slides.tsx">{`import { Slide, SlideTitle, SlideCode } from 'nextjs-slides';

export const slides = [
  <Slide key="intro">
    <SlideTitle>My Presentation</SlideTitle>
    <SlideCode title="example.ts">{\`const x = 1;\`}</SlideCode>
  </Slide>,
];`}</SlideCode>
    <SlideNote>Keyboard navigation · Progress dots · Breakout routes</SlideNote>
  </Slide>,

  // 10. Get started
  <Slide key="end">
    <SlideTitle className="font-pixel">Start building.</SlideTitle>
    <SlideSubtitle>Clone the repo, run bun dev, and start creating</SlideSubtitle>
    <SlideCode title="getting-started.ts">{`git clone https://github.com/aurorascharff/nextjs-demo-kit
cd nextjs-demo-kit
bun install
bun run dev`}</SlideCode>
    <div className="mt-6 flex items-center gap-4">
      <SlideLink href="/">Explore the demo →</SlideLink>
      <SlideLink href="https://github.com/aurorascharff/nextjs-demo-kit" variant="ghost">
        GitHub
      </SlideLink>
    </div>
  </Slide>,
];
