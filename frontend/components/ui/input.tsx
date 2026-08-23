import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Height matches Button's default so an input and a button sit level
        // in the same row — the two are constantly paired in the donation forms.
        "flex h-10 w-full min-w-0 rounded-md border border-input bg-card px-3 py-1 text-base shadow-xs md:text-sm",
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "transition-[color,box-shadow,border-color] duration-[--duration-base] ease-[--ease-out]",
        "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/25",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
