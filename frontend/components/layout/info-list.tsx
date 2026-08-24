// Read-only labelled values.
// The profile screens previously rendered these inside bordered boxes that
// looked exactly like text inputs — a false affordance. A definition list reads
// as information, and leaves the input styling to things you can actually type in.
import { cn } from "@/lib/utils";

export function InfoList({
  className,
  ...props
}: React.ComponentProps<"dl">) {
  return (
    <dl
      className={cn("divide-y divide-border", className)}
      {...props}
    />
  );
}

interface InfoRowProps {
  label: string;
  /** Falls back to a muted placeholder when there is nothing to show yet. */
  children?: React.ReactNode;
  empty?: string;
  className?: string;
}

export function InfoRow({ label, children, empty, className }: InfoRowProps) {
  const hasValue =
    children !== null && children !== undefined && children !== "";

  return (
    <div
      className={cn(
        "grid gap-1 py-3 sm:grid-cols-[minmax(0,12rem)_1fr] sm:gap-4",
        className,
      )}
    >
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "min-w-0 break-words text-sm",
          hasValue ? "text-foreground" : "text-muted-foreground/70 italic",
        )}
      >
        {hasValue ? children : (empty ?? "—")}
      </dd>
    </div>
  );
}
