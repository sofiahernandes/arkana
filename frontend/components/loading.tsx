// Loading state component displayed while asynchronous page data is still being resolved.
// Prefer `LoadingPanel` from components/layout/state-panel.tsx for page-level
// waits — it holds the layout instead of pushing content around. This stays for
// the small in-place spinners inside the contribution grids.
import React from "react";

import { cn } from "@/lib/utils";

interface Properties {
  className?: string;
  /** Announced to assistive tech while the spinner is on screen. */
  label?: string;
}

const Loading: React.FC<Properties> = ({
  className,
  label = "Carregando…",
}) => {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      <div
        aria-hidden
        className={cn(
          "size-16 animate-spin rounded-full border-4 border-border border-t-primary",
          className,
        )}
      />
    </div>
  );
};

export default Loading;
