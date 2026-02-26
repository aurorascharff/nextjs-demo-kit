import Link from 'next/link';
import { ComponentExample } from './_components/ComponentExample';

export default function Page() {
  return (
    <>
      <div className="fixed top-4 right-4 z-60">
        <Link
          href={'/slides/1' as never}
          className="bg-foreground text-background hidden items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium tracking-wide transition-opacity hover:opacity-80 lg:inline-flex"
        >
          Start Slides →
        </Link>
      </div>
      <ComponentExample />
    </>
  );
}
