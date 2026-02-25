import {
  Slide,
  SlideBadge,
  SlideCode,
  SlideList,
  SlideListItem,
  SlideNote,
  SlideSubtitle,
  SlideTitle,
} from './_components/Slide';
import { SlideLink } from './_components/SlideLink';

export const slides: React.ReactNode[] = [
  <Slide key="welcome">
    <SlideBadge>Slide Deck</SlideBadge>
    <SlideTitle>Code Your Slides</SlideTitle>
    <SlideSubtitle>A composable slide system built with React, ViewTransitions, and Geist</SlideSubtitle>
    <SlideNote>Press → or Space to continue · ← to go back · Click anywhere</SlideNote>
  </Slide>,

  <Slide key="getting-started">
    <SlideBadge>Setup</SlideBadge>
    <SlideTitle className="text-3xl sm:text-4xl md:text-5xl">Getting Started</SlideTitle>
    <SlideCode title="app/slides/[page]/page.tsx">{`import { slides } from '@/app/slides/slides';

export default async function SlidePage({ params }) {
  const { page } = await params;
  return slides[Number(page) - 1];
}`}</SlideCode>
    <SlideNote>Each slide is a page — /slides/1, /slides/2, etc.</SlideNote>
  </Slide>,

  <Slide key="primitives">
    <SlideBadge>Primitives</SlideBadge>
    <SlideTitle className="text-3xl sm:text-4xl md:text-5xl">Building Blocks</SlideTitle>
    <SlideCode title="Every component in one slide">{`<Slide align="left">
  <SlideBadge>Topic</SlideBadge>
  <SlideTitle>Heading</SlideTitle>
  <SlideSubtitle>Secondary text</SlideSubtitle>
  <SlideCode title="file.ts">{\`const x = 1;\`}</SlideCode>
  <SlideList>
    <SlideListItem>Bullet point</SlideListItem>
  </SlideList>
  <SlideNote>Footnote text</SlideNote>
  <SlideLink href="/slides/1">Back →</SlideLink>
</Slide>`}</SlideCode>
  </Slide>,

  <Slide key="navigation" align="left">
    <SlideBadge>Navigation</SlideBadge>
    <SlideTitle className="text-3xl sm:text-4xl md:text-5xl">How to Navigate</SlideTitle>
    <SlideList>
      <SlideListItem>→ / Space — Next slide</SlideListItem>
      <SlideListItem>← — Previous slide</SlideListItem>
      <SlideListItem>Click right ⅔ — Next slide</SlideListItem>
      <SlideListItem>Click left ⅓ — Previous slide</SlideListItem>
      <SlideListItem>Progress dots — Jump to any slide</SlideListItem>
    </SlideList>
    <SlideNote>All transitions are animated with the browser ViewTransition API.</SlideNote>
  </Slide>,

  <Slide key="code">
    <SlideBadge>Code</SlideBadge>
    <SlideTitle className="text-3xl sm:text-4xl md:text-5xl">Syntax Highlighting</SlideTitle>
    <SlideCode title="example.ts">{`const name = 'Vercel';
const items = [1, 2, 3];

async function greet(user: string) {
  const message = \`Hello, \${user}!\`;
  console.log(message);
  return { ok: true };
}`}</SlideCode>
    <SlideNote>Powered by sugar-high · Themed with CSS variables · Vercel dark/light</SlideNote>
  </Slide>,

  <Slide key="view-transitions">
    <SlideBadge>Animations</SlideBadge>
    <SlideTitle className="text-3xl sm:text-4xl md:text-5xl">ViewTransitions</SlideTitle>
    <SlideCode title="How slide animations work">{`<ViewTransition key={\`slide-\${current}\`}>
  <div>{slides[current]}</div>
</ViewTransition>`}</SlideCode>
    <SlideSubtitle>
      State changes inside startTransition trigger CSS view-transition animations automatically
    </SlideSubtitle>
  </Slide>,

  <Slide key="theme-links">
    <SlideBadge>Features</SlideBadge>
    <SlideTitle className="text-3xl sm:text-4xl md:text-5xl">Theme & Links</SlideTitle>
    <SlideSubtitle>
      Slides follow your app theme — toggle light/dark anytime. Use SlideLink to connect slides to your app.
    </SlideSubtitle>
    <SlideCode title="End slide with a link back">{`<Slide>
  <SlideTitle>Thank You</SlideTitle>
  <SlideLink href="/">Back to Demo →</SlideLink>
</Slide>`}</SlideCode>
  </Slide>,

  <Slide key="end">
    <SlideTitle>Now go build something.</SlideTitle>
    <SlideSubtitle>Navigate back to the demo or start creating your own slides.</SlideSubtitle>
    <div className="mt-4 flex items-center gap-4">
      <SlideLink href="/" exit>
        Go to Demo →
      </SlideLink>
      <SlideLink href="https://github.com/aurorascharff/nextjs-shadcn-starter" variant="ghost">
        GitHub
      </SlideLink>
    </div>
  </Slide>,
];
