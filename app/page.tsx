import { Github } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { ComponentExample } from './_components/ComponentExample';
import type { Route } from 'next';

const techStack = ['Next.js 16', 'React 19', 'Tailwind v4', 'shadcn/ui', 'Prisma'] as const;

export default function Page() {
  return (
    <div className="bg-background mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 overflow-x-hidden p-6 pb-24 lg:px-12 lg:py-8 2xl:max-w-6xl">
      <nav className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm font-medium">Next.js Demo Kit</span>
        <Link
          href="https://github.com/aurorascharff/nextjs-demo-kit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-70"
        >
          <Github className="size-4" />
          View on GitHub
        </Link>
      </nav>

      <section className="flex flex-col gap-3">
        <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">Build demos fast</h1>
        <p className="text-muted-foreground max-w-lg text-base leading-relaxed">
          A toolkit for interactive demos with React 19, Next.js 16, and modern patterns. shadcn/ui &middot; Prisma
          &middot; Tailwind v4
        </p>
        <Link href={'/slides/1' as Route} className={buttonVariants({ size: 'default', variant: 'default' }) + ' mt-1 self-start'}>
          Start Slides &rarr;
        </Link>
      </section>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <ComponentExample />
      </div>

      <section className="flex flex-col gap-4">
        <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">Component Showcase</span>
        <div className="flex flex-wrap gap-3">
          {techStack.map(tech => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  );
}
