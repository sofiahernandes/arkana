import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md text-sm font-medium",
    "transition-colors duration-[--duration-base] ease-[--ease-out]",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
  ],
  {
    variants: {
      variant: {
        /** Primary action. One per view. */
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover",
        /** Brand rose. Uses the AA-safe fill — plain --secondary fails contrast under white text. */
        secondary:
          "bg-secondary-strong text-secondary-foreground shadow-sm hover:bg-secondary-hover",
        /** Blush fill for supporting actions that should still read as brand. */
        soft: "bg-terciary text-terciary-foreground hover:bg-terciary/70",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive-hover focus-visible:ring-destructive/30",
        outline:
          "border border-input bg-card shadow-xs hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        default: "h-10 px-4 has-[>svg]:px-3.5",
        lg: "h-12 px-6 text-base has-[>svg]:px-5",
        icon: "size-10",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /** Shows a spinner and blocks interaction. Every submit path should use it. */
    loading?: boolean;
  }) {
  const shared = {
    "data-slot": "button",
    className: cn(buttonVariants({ variant, size, className })),
    "aria-busy": loading || undefined,
    ...props,
  };

  // Slot requires exactly one child, and a `{false && …}` sibling still counts
  // as a second one — so asChild forwards `children` untouched.
  if (asChild) {
    return <Slot {...shared}>{children}</Slot>;
  }

  return (
    <button {...shared} disabled={disabled || loading}>
      {loading && <Loader2 className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export { Button, buttonVariants };
