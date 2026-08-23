// Card grid view of contributions. `team` shows one group's own history, `report` shows every group.
"use client";

import React, { useEffect } from "react";
import { HandHeart } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ErrorPanel, LoadingPanel } from "@/components/layout/state-panel";
import formatBRL from "@/hooks/use-format-currency";
import { useContributions } from "@/hooks/use-contributions";
import type { Contribution } from "@/lib/normalize-contributions";

interface ContributionsGridProps {
  /** `"all"` for every group, or a participant RA. */
  scope: "all" | string;
  variant: "team" | "report";
  emptyTitle: string;
  emptyDescription: string;
  onSelect?: (contribution: Contribution) => void;
  refreshKey?: number;
}

// `text-secondary` would be small rose text at 3.7:1, so the hover tint uses
// the AA-safe rose. See DESIGN.md, "The two-pink rule".
const cardClass = [
  "w-full rounded-lg border border-border bg-card p-3 text-left shadow-sm",
  "transition-colors duration-[--duration-base] ease-[--ease-out]",
  "hover:bg-secondary/5 hover:text-secondary-strong hover:shadow-md",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
].join(" ");

export default function ContributionsGrid({
  scope,
  variant,
  emptyTitle,
  emptyDescription,
  onSelect,
  refreshKey = 0,
}: ContributionsGridProps) {
  const { contributions, loading, error, refetch } = useContributions(scope);

  // The parent bumps refreshKey after a delete so the list reloads.
  useEffect(() => {
    if (refreshKey > 0) refetch();
  }, [refreshKey, refetch]);

  // Order matters: the empty state used to render before loading was checked,
  // so "Nenhuma contribuição" flashed on every fetch.
  if (loading) {
    return <LoadingPanel label="Carregando contribuições…" rows={3} />;
  }

  if (error) {
    return <ErrorPanel onRetry={refetch} />;
  }

  if (contributions.length === 0) {
    return (
      <div className="mx-auto w-full max-w-md rounded-lg border border-border bg-card shadow-sm">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HandHeart size={44} strokeWidth={1.2} />
            </EmptyMedia>
            <EmptyTitle>{emptyTitle}</EmptyTitle>
            <EmptyDescription>{emptyDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {contributions.map((c, index) => (
        <button
          key={`contribuicao-${c.uuid}-${index}`}
          type="button"
          className={cardClass}
          onClick={() => onSelect?.(c)}
        >
          <p className="mb-1 text-base font-semibold">
            {variant === "report" ? c.NomeTime : c.Fonte}
          </p>
          <p className="mb-3 text-xs text-muted-foreground">
            {new Date(c.DataContribuicao).toLocaleDateString("pt-BR")}
          </p>

          <dl className="space-y-1 text-sm">
            {variant === "report" && (
              <>
                <CardRow label="Fonte">{c.Fonte}</CardRow>
                <CardRow label="RA do aluno">{c.RaUsuario}</CardRow>
              </>
            )}
            <CardRow label="Tipo">{c.TipoDoacao}</CardRow>
            <CardRow label="Quantidade">
              {Intl.NumberFormat("pt-BR").format(c.Quantidade)}
            </CardRow>
            {variant === "team" && (
              <CardRow label="Gastos">{formatBRL(c.Gastos)}</CardRow>
            )}
          </dl>
        </button>
      ))}
    </div>
  );
}

function CardRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium tabular-nums">{children}</dd>
    </div>
  );
}
