// Tooltip chart configuration used to present richer point details in the reporting UI.
"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, XAxis } from "recharts";
import { Contribution } from "@/components/administrator/contributions-table/columns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { v4 as uuidv4 } from "uuid";
import { getMockContributions, isMockMode } from "@/lib/mock-db";

export const description = "Gráfico de contribuições financeiras e alimentares";

const chartConfig = {
  running: {
    label: "Financeiras",
    color: "var(--chart-1)",
  },
  swimming: {
    label: "Alimentícias",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function BiggestContributionsChart() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Loads the full contribution feed once and normalizes it into the chart input model used by the report cards.
  useEffect(() => {
    const controller = new AbortController();
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    let active = true;

    // Converts the backend payload into the unified contribution format before any chart aggregation happens.
    async function fetchContributions() {
      try {
        setLoading(true);
        setError(null);

        const raw = isMockMode()
          ? getMockContributions()
          : await fetch(`${backend_url}/api/contributions`, {
              cache: "no-store",
              signal: controller.signal,
            }).then((res) => {
              if (!res.ok) throw new Error("Erro ao buscar contribuições");
              return res.json();
            });
        if (!active) return;

        const data: Contribution[] = Array.isArray(raw)
          ? raw.map((r: any) => {
              const IdContribuicao = Number(
                r.IdContribuicao ??
                  r.IdContribuicaoFinanceira ??
                  r.IdContribuicaoAlimenticia,
              );

              const idComp =
                r?.comprovante?.IdComprovante ?? r?.IdComprovante ?? null;

              const rawImg =
                r?.Comprovante ??
                r?.comprovante?.Imagem ??
                r?.Comprovante?.Imagem ??
                r?.Imagem ??
                r?.comprovantes?.[0]?.Imagem ??
                r?.UrlComprovante ??
                null;

              let comprovante:
                | { IdComprovante: number; Imagem: string }
                | undefined;

              // Resolves receipt paths into displayable URLs so chart tooltips can still access receipt metadata consistently.
              if (rawImg && String(rawImg).trim() !== "") {
                const s = String(rawImg).trim();
                const isAbsolute = /^https?:\/\//i.test(s);
                const base = (
                  process.env.NEXT_PUBLIC_BACKEND_URL || ""
                ).replace(/\/$/, "");
                const finalUrl = isAbsolute
                  ? s
                  : `${base}/uploads/${s.replace(/^\/+/, "")}`;

                comprovante = {
                  IdComprovante: idComp != null ? Number(idComp) : 0,
                  Imagem: finalUrl,
                };
              }

              return {
                RaUsuario: Number(r.RaUsuario),
                TipoDoacao: String(r.TipoDoacao ?? ""),
                Quantidade:
                  r.Quantidade != null
                    ? Number(
                        String(r.Quantidade)
                          .replace(/\./g, "")
                          .replace(",", "."),
                      )
                    : 0,
                Meta:
                  r.Meta != null
                    ? Number(
                        String(r.Meta).replace(/\./g, "").replace(",", "."),
                      )
                    : undefined,
                Gastos:
                  r.Gastos != null
                    ? Number(
                        String(r.Gastos).replace(/\./g, "").replace(",", "."),
                      )
                    : undefined,
                Fonte: r.Fonte ?? "",
                comprovante,
                IdContribuicao,
                DataContribuicao: String(r.DataContribuicao ?? ""),
                NomeAlimento: r.NomeAlimento ?? undefined,
                PontuacaoAlimento: r.PontuacaoAlimento ?? undefined,
                NomeTime: r.NomeTime ?? undefined,
                PesoUnidade: r.PesoUnidade ?? undefined,
                uuid: uuidv4(),
              };
            })
          : [];

        setContributions(data);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          setError(err?.message ?? "Erro inesperado");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchContributions();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  // Aggregates contributions by date and separates financial value from food weight for the comparative report.
  const chartData =
    contributions.length > 0
      ? Object.values(
          contributions.reduce(
            (acc: any, c: Contribution) => {
              const date = new Date(c.DataContribuicao)
                .toISOString()
                .slice(0, 10);
              if (!acc[date]) acc[date] = { date, running: 0, swimming: 0 };

              if (c.TipoDoacao === "Financeira") {
                acc[date].running += c.Quantidade;
              } else if (c.TipoDoacao === "Alimenticia") {
                acc[date].swimming += c.Quantidade * (c.PesoUnidade ?? 1);
              }

              return acc;
            },
            {} as Record<
              string,
              { date: string; running: number; swimming: number }
            >,
          ),
        )
      : [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Período de maiores contribuições</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Período de maiores contribuições</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-destructive">Erro: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Período de maiores contribuições</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Período de maiores contribuições</CardTitle>
        <CardDescription>
          Agrupado por dia, considerando doações financeiras e alimentares
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                })
              }
            />
            <Bar
              dataKey="running"
              stackId="a"
              fill="var(--color-running)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="swimming"
              stackId="a"
              fill="var(--color-swimming)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={<ChartTooltipContent hideIndicator hideLabel />}
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
