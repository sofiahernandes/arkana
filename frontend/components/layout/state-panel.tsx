// Loading and error surfaces. Four pages tracked an `error` in state and never
// rendered it — failures were silent. These give every page one place to put it.
"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingPanelProps {
  /** Announced to assistive tech while the skeleton is on screen. */
  label?: string;
  /** Number of placeholder rows. Match it to the content that will land. */
  rows?: number;
  className?: string;
}

/**
 * A skeleton of the incoming layout, not a spinner in the middle of the page:
 * it holds the position so content does not jump in.
 */
export function LoadingPanel({
  label = "Carregando…",
  rows = 4,
  className,
}: LoadingPanelProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn("space-y-4", className)}
    >
      <span className="sr-only">{label}</span>
      <Skeleton className="h-9 w-56" />
      <div className="space-y-3 rounded-lg border border-border bg-card p-4 shadow-sm">
        {Array.from({ length: rows }, (_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}

interface ErrorPanelProps {
  /** Name the problem in the product's own words. */
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorPanel({
  title = "Não foi possível carregar os dados",
  description = "Verifique sua conexão e tente novamente. Se o problema continuar, avise a coordenação do projeto.",
  onRetry,
  className,
}: ErrorPanelProps) {
  return (
    <Empty className={cn("border border-dashed border-border", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-terciary text-destructive">
          <AlertTriangle aria-hidden />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </Empty>
  );
}
