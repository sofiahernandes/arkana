"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

// The product is light-only and mounts no ThemeProvider, so there is no theme
// to read — asking next-themes for one just returned "system" regardless.
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-md)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
