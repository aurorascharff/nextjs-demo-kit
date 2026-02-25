'use client';

import { useOptimistic, useState, useTransition } from 'react';

// Simulates a server action with delay
async function fakeAction(ms = 1500): Promise<void> {
  await new Promise(resolve => {
    return setTimeout(resolve, ms);
  });
}

async function fakeToggle(value: boolean): Promise<boolean> {
  await fakeAction();
  if (Math.random() < 0.2) {
    throw new Error('Server error');
  }
  return value;
}

// --- useTransition demo ---
export function PendingDemo() {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(false);
    startTransition(async () => {
      await fakeAction(1200);
      setSaved(true);
    });
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleSave}
        disabled={isPending}
        className="bg-foreground text-background rounded-lg px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>
      {saved && !isPending && <p className="text-xs text-emerald-600 dark:text-emerald-400">Saved!</p>}
      {!saved && !isPending && (
        <p className="text-muted-foreground/50 text-xs">Button disables and shows pending text</p>
      )}
    </div>
  );
}

// --- useOptimistic demo ---
export function ToggleDemo() {
  const [archived, setArchived] = useState(false);
  const [optimisticArchived, setOptimisticArchived] = useOptimistic(archived);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleToggle() {
    setError(null);
    startTransition(async () => {
      setOptimisticArchived(!optimisticArchived);
      try {
        const result = await fakeToggle(!archived);
        setArchived(result);
      } catch {
        setError('Failed — reverted automatically');
      }
    });
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <div
          data-pending={optimisticArchived !== archived || undefined}
          className="border-border bg-card flex items-center gap-3 rounded-lg border px-4 py-2.5 transition-opacity data-[pending]:opacity-60"
        >
          <span className="text-foreground text-sm font-medium">Post</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              optimisticArchived
                ? 'bg-muted text-muted-foreground'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {optimisticArchived ? 'Archived' : 'Published'}
          </span>
        </div>
        <button
          onClick={handleToggle}
          disabled={isPending}
          className="bg-foreground text-background rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {optimisticArchived ? 'Unarchive' : 'Archive'}
        </button>
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
      {!error && (
        <p className="text-muted-foreground/50 text-xs">Updates instantly · ~20% failure rate to show revert</p>
      )}
    </div>
  );
}

// --- useFormStatus demo ---
export function FormDemo() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<'idle' | 'success' | 'error'>('idle');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult('idle');
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await fakeAction(1000);
      const title = formData.get('title') as string;
      setResult(title.trim() ? 'success' : 'error');
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <input
          name="title"
          placeholder="Post title..."
          className="border-border bg-card text-foreground placeholder:text-muted-foreground rounded-lg border px-3 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-foreground text-background rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {isPending ? 'Creating...' : 'Create'}
        </button>
      </div>
      {result === 'success' && <p className="text-xs text-emerald-600 dark:text-emerald-400">Post created!</p>}
      {result === 'error' && <p className="text-destructive text-xs">Title is required</p>}
      {result === 'idle' && !isPending && (
        <p className="text-muted-foreground/50 text-xs">Submit empty to see validation feedback</p>
      )}
    </form>
  );
}
