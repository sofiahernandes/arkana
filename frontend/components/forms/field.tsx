// One labelled form field for the whole product.
// Replaces the hand-rolled `bg-[white] border border-[#b4b4b4] focus:outline-none`
// input that was pasted into six files — that pattern also removed the focus
// ring without replacing it, which made every form unusable by keyboard.
"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldProps extends Omit<React.ComponentProps<"input">, "id"> {
  label: string;
  /** Persistent helper text. Shown below the control, above any error. */
  hint?: string;
  /** Naming the problem replaces the hint and marks the control invalid. */
  error?: string;
  /** Pass a Select, Textarea or custom control to label it instead of an Input. */
  children?: React.ReactNode;
  className?: string;
  controlClassName?: string;
}

export default function Field({
  label,
  hint,
  error,
  children,
  className,
  controlClassName,
  required,
  ...inputProps
}: FieldProps) {
  const reactId = React.useId();
  const id = inputProps.name ? `field-${inputProps.name}` : reactId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-destructive" aria-hidden>
            *
          </span>
        )}
      </Label>

      {children ?? (
        <Input
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={controlClassName}
          {...inputProps}
        />
      )}

      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
