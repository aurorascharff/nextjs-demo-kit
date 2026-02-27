import { cn } from '@/lib/utils';

function ShowcaseWrapper({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="showcase-wrapper"
      className={cn('grid h-full w-full min-w-0 items-start gap-6 md:grid-cols-2 md:gap-8', className)}
      {...props}
    />
  );
}

function Showcase({
  title,
  children,
  className,
  containerClassName,
  ...props
}: React.ComponentProps<'div'> & {
  title: string;
  containerClassName?: string;
}) {
  return (
    <div
      data-slot="showcase"
      className={cn(
        'mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 overflow-hidden lg:max-w-none',
        containerClassName,
      )}
      {...props}
    >
      <div className="text-muted-foreground px-1.5 py-2 text-xs font-medium">{title}</div>
      <div
        data-slot="showcase-content"
        className={cn(
          "bg-background text-foreground flex min-h-0 min-w-0 flex-1 flex-col items-start gap-4 overflow-hidden border border-dashed p-4 *:[div:not([class*='w-'])]:w-full",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export { ShowcaseWrapper, Showcase };
