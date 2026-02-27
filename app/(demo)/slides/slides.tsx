import {
  Slide,
  SlideBadge,
  SlideCode,
  SlideDemo,
  SlideHeaderBadge,
  SlideLink,
  SlideSpeaker,
  SlideSpeakerGrid,
  SlideSplitLayout,
  SlideStatement,
  SlideStatementList,
  SlideSubtitle,
  SlideTitle,
} from 'nextjs-slides';
import { TabListDemo } from '@/app/(demo)/slides/_components/TabListDemo';

export const slides: React.ReactNode[] = [
  <Slide key="intro" align="center">
    <SlideBadge>Welcome</SlideBadge>
    <SlideTitle className="mt-6 text-3xl sm:text-4xl md:text-5xl">Next.js Demo Kit</SlideTitle>
    <SlideSubtitle className="mt-4">A quick tour of the starter and its patterns</SlideSubtitle>
  </Slide>,

  <Slide key="title" align="left">
    <SlideHeaderBadge>Next.js Demo Kit</SlideHeaderBadge>
    <SlideTitle className="font-pixel">Build Demos Fast</SlideTitle>
    <SlideSubtitle>A toolkit for interactive demos with React 19, Next.js 16, and modern patterns</SlideSubtitle>
    <SlideSpeakerGrid className="mt-8">
      <SlideSpeaker name="Your Name" title="Your Title" />
    </SlideSpeakerGrid>
  </Slide>,

  <SlideSplitLayout
    key="stack"
    left={
      <>
        <SlideBadge>Stack</SlideBadge>
        <SlideTitle className="mt-6 text-3xl sm:text-4xl md:text-5xl">What&apos;s included</SlideTitle>
        <SlideSubtitle className="mt-4">Next.js 16 · React 19 · Tailwind v4 · shadcn/ui · Prisma</SlideSubtitle>
      </>
    }
    right={
      <SlideStatementList>
        <SlideStatement title="app/" description="Pages, layouts, route-local _components" />
        <SlideStatement title="components/design/" description="Action props (TabList, Select, EditableText)" />
        <SlideStatement title="components/ui/" description="shadcn primitives on Base UI" />
        <SlideStatement title="data/queries/" description="cache() for server-side fetching" />
        <SlideStatement title="data/actions/" description="Server Actions with updateTag / revalidateTag" />
      </SlideStatementList>
    }
  />,

  <SlideSplitLayout
    key="action-props"
    left={
      <>
        <SlideBadge>Action Props</SlideBadge>
        <SlideTitle className="mt-6 text-3xl sm:text-4xl md:text-5xl">Async coordination</SlideTitle>
        <SlideSubtitle className="mt-4">
          Components own useOptimistic + useTransition — consumers pass changeAction
        </SlideSubtitle>
        <SlideDemo label="Try it" className="mt-6">
          <TabListDemo />
        </SlideDemo>
      </>
    }
    right={
      <SlideCode title="usage.tsx">{`const [activeTab, setActiveTab] = useState('overview');

<TabList
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

  <Slide key="data" align="left">
    <SlideBadge>Data</SlideBadge>
    <SlideTitle className="text-3xl sm:text-4xl md:text-5xl">Queries &amp; mutations</SlideTitle>
    <SlideCode title="data/queries/posts.ts + data/actions/posts.ts">{`// Query — 'use cache' + cacheTag, or cache()
export async function getPosts() {
  'use cache';
  cacheTag('posts');
  return db.post.findMany();
}

// Action — updateTag after mutate (read-your-own-writes)
'use server';
export async function createPostAction(formData: FormData) {
  const post = await db.post.create({ data: { ... } });
  updateTag('posts');
  updateTag(\`post-\${post.id}\`);
}`}</SlideCode>
  </Slide>,

  <Slide key="cache" align="left">
    <SlideBadge>Performance</SlideBadge>
    <SlideTitle className="text-3xl sm:text-4xl md:text-5xl">cacheComponents</SlideTitle>
    <SlideSubtitle>Static shell for server components without dynamic data</SlideSubtitle>
    <SlideCode title="next.config.ts">{`const nextConfig: NextConfig = {
  cacheComponents: true,  // Stable in Next.js 16
  reactCompiler: true,
  typedRoutes: true,
};`}</SlideCode>
  </Slide>,

  <Slide key="slides">
    <SlideBadge>This deck</SlideBadge>
    <SlideTitle className="text-3xl sm:text-4xl md:text-5xl">nextjs-slides</SlideTitle>
    <SlideSubtitle>Composable primitives · ViewTransitions · Keyboard nav</SlideSubtitle>
    <SlideCode title="app/slides/slides.tsx">{`export const slides = [
  <Slide key="intro">
    <SlideTitle>Hello</SlideTitle>
    <SlideCode title="x.ts">{\`const x = 1;\`}</SlideCode>
  </Slide>,
];`}</SlideCode>
  </Slide>,

  <Slide key="end">
    <SlideTitle className="font-pixel">Start building.</SlideTitle>
    <SlideSubtitle>Clone, install, run</SlideSubtitle>
    <SlideCode title="setup.ts">{`// git clone https://github.com/aurorascharff/nextjs-demo-kit
// bun install && bun run dev`}</SlideCode>
    <div className="mt-6 flex items-center gap-4">
      <SlideLink href="/">Explore demo →</SlideLink>
      <SlideLink href="https://github.com/aurorascharff/nextjs-demo-kit" variant="ghost">
        GitHub
      </SlideLink>
    </div>
  </Slide>,
];
