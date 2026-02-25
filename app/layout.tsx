import './globals.css';

import { GeistPixelSquare } from 'geist/font/pixel';
import { Github } from 'lucide-react';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  description: 'A Next.js 16 starter with React 19, Prisma, Tailwind CSS, and shadcn/ui',
  title: 'Next.js Starter',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={geistSans.variable} suppressHydrationWarning>
      <NuqsAdapter>
        <body className={`${geistMono.variable} ${GeistPixelSquare.variable} antialiased`}>
          <ThemeProvider>
            <main>{children}</main>
            <div className="fixed bottom-4 left-4 z-60 flex items-center gap-2">
              <Link
                href="https://github.com/aurorascharff/nextjs-shadcn-starter"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="View source on GitHub"
              >
                <Github className="size-5" />
              </Link>
              <ThemeToggle />
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </NuqsAdapter>
    </html>
  );
}
