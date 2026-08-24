// One page title treatment for the whole product.
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  /** One line of orientation. Skip it when the title already says everything. */
  description?: string;
  /** Primary action for the page, right-aligned on wide screens. */
  actions?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1.5">
        {/* Uppercase needs positive tracking to stay readable at this size. */}
        <h1 className="text-2xl font-semibold uppercase tracking-wide text-primary">
          {title}
        </h1>
        {description && (
          <p className="max-w-prose text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </header>
  );
}
