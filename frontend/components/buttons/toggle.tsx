// Switches the contribution history between grid and table layouts.
// Previously a single icon button whose two style branches were identical, so
// the current view was never actually indicated. A segmented control shows both
// options and which one is on.
import { SetStateAction } from "react";
import { Grip, Rows3 } from "lucide-react";

import { cn } from "@/lib/utils";

interface Properties {
  /** Matches the call sites: false renders the card grid, true renders the table. */
  buttonSelected: boolean;
  setButtonSelected: (arg: SetStateAction<boolean>) => void;
}

const options = [
  { value: false, label: "Cartões", Icon: Grip },
  { value: true, label: "Tabela", Icon: Rows3 },
];

export default function SwitchViewButton({
  buttonSelected,
  setButtonSelected,
}: Properties) {
  return (
    <div
      role="group"
      aria-label="Formato de visualização"
      className="inline-flex items-center gap-1 rounded-md border border-input bg-muted p-1"
    >
      {options.map(({ value, label, Icon }) => {
        const active = buttonSelected === value;

        return (
          <button
            key={label}
            type="button"
            onClick={() => setButtonSelected(value)}
            aria-pressed={active}
            title={label}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-sm px-2.5 text-sm font-medium",
              "transition-colors duration-[--duration-base] ease-[--ease-out]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              active
                ? "bg-card text-primary shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
            <span className="sr-only sm:not-sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
