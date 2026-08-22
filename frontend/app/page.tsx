// Public dashboard page. Loads contribution data and renders the public ranking and summary cards.
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { BookOpen, FileText } from "lucide-react";

import Hero from "@/components/hero";
import PageShell from "@/components/layout/page-shell";
import { ErrorPanel, LoadingPanel } from "@/components/layout/state-panel";
import { Card, CardContent } from "@/components/ui/card";
import { useContributions } from "@/hooks/use-contributions";
import { overallMetrics } from "@/lib/overall-metrics";
import type { Contribution } from "@/lib/normalize-contributions";

const RANKING_SIZE = 8;

// Food totals are quantity × unit weight; a missing unit weight means we can't
// rank the row, so it sorts as zero rather than as NaN.
const foodWeight = (c: Contribution) =>
  c.Quantidade * (c.PesoUnidade ?? 0) || 0;

export default function PublicDashboard() {
  const { contributions, loading, error, refetch } = useContributions("all");

  const biggestMoneyDonations = useMemo(
    () =>
      contributions
        .filter((item) => item.TipoDoacao === "Financeira")
        .sort((a, b) => b.Quantidade - a.Quantidade)
        .slice(0, RANKING_SIZE),
    [contributions],
  );

  const biggestFoodDonations = useMemo(
    () =>
      contributions
        .filter((item) => item.TipoDoacao === "Alimenticia")
        .sort((a, b) => foodWeight(b) - foodWeight(a))
        .slice(0, RANKING_SIZE),
    [contributions],
  );

  return (
    <PageShell ground="background" banner={<Hero />}>
      <div id="public-graph" className="space-y-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {overallMetrics.map((metric) => (
            <Card
              key={metric.label}
              className="justify-center border-none bg-primary py-4 shadow-sm"
            >
              <CardContent className="px-4">
                <div className="flex items-center gap-3 text-primary-foreground">
                  <metric.icon
                    className="size-5 shrink-0 md:size-6"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs text-primary-foreground/80">
                      {metric.label}
                    </p>
                    <p className="text-xl font-semibold tabular-nums md:text-2xl">
                      {metric.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {loading && <LoadingPanel label="Carregando doações…" rows={6} />}

        {/* The error state was tracked but never rendered — failures were silent. */}
        {!loading && error && (
          <ErrorPanel
            title="Não foi possível carregar as doações"
            onRetry={refetch}
          />
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <RankingCard
              title="Maiores doações financeiras"
              items={biggestMoneyDonations}
              empty="Nenhuma doação financeira encontrada."
              format={(item) =>
                item.Quantidade.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }
            />
            <RankingCard
              title="Maiores doações alimentícias"
              items={biggestFoodDonations}
              empty="Nenhuma doação alimentícia encontrada."
              format={(item) =>
                `${foodWeight(item).toLocaleString("pt-BR")} kg`
              }
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ActionLink
            href="/register/login"
            icon={BookOpen}
            label="Registrar doações"
          />
          <ActionLink
            href="/public-reports"
            icon={FileText}
            label="Ver relatórios"
          />
        </div>
      </div>
    </PageShell>
  );
}

function RankingCard({
  title,
  items,
  empty,
  format,
}: {
  title: string;
  items: Contribution[];
  empty: string;
  format: (item: Contribution) => string;
}) {
  return (
    <Card className="gap-4 border-secondary/40">
      <CardContent>
        <h2 className="mb-3 text-base font-semibold text-primary">{title}</h2>

        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {empty}
          </p>
        ) : (
          <ol className="divide-y divide-border">
            {items.map((item, index) => (
              <li
                key={`${item.uuid}-${index}`}
                className="flex items-baseline justify-between gap-4 py-2"
              >
                <span className="min-w-0 truncate text-sm">
                  {item.Fonte || "Fonte desconhecida"}
                </span>
                {/* Small rose text needs the AA-safe variant. */}
                <span className="shrink-0 text-sm font-medium tabular-nums text-secondary-strong">
                  {format(item)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

function ActionLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex h-20 flex-col items-center justify-center gap-2 rounded-lg border border-secondary/40 bg-terciary/60 text-terciary-foreground transition-colors duration-[--duration-base] ease-[--ease-out] hover:bg-terciary"
    >
      <Icon className="size-5" strokeWidth={1.75} aria-hidden />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
