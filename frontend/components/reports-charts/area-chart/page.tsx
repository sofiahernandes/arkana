// Area chart showcase/configuration used by the reporting pages.
"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Contribution } from "@/components/administrator/contributions-table/columns";
import { v4 as uuidv4 } from "uuid";
import { getMockContributions, isMockMode } from "@/lib/mock-db";

export const description =
  "Gráfico de arrecadações financeiras ao longo do tempo";

const chartConfig = {
  desktop: {
    label: "Financeira",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function FinanContribuitionsChart() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Loads the contribution feed once and filters it down to the financial history required by this chart.
  useEffect(() => {
    const controller = new AbortController();
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Normalizes the raw contribution payload into the lightweight shape needed for monthly aggregation.
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

        const data: Contribution[] = Array.isArray(raw)
          ? raw.map((r: any) => ({
              IdContribuicao:
                r.IdContribuicao ??
                r.IdContribuicaoFinanceira ??
                r.IdContribuicaoAlimenticia,
              RaUsuario: Number(r.RaUsuario),
              TipoDoacao: String(r.TipoDoacao ?? ""),
              Quantidade:
                r.Quantidade != null
                  ? Number(
                      String(r.Quantidade).replace(/\./g, "").replace(",", "."),
                    )
                  : 0,
              DataContribuicao: String(r.DataContribuicao ?? ""),
              NomeTime: r.NomeTime ?? undefined,
              PontuacaoAlimento: r.PontuacaoAlimento ?? undefined,
              PesoUnidade: r.PesoUnidade ?? undefined,
              uuid: uuidv4(),
            }))
          : [];

        setContributions(data);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          setError(err?.message ?? "Erro inesperado");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchContributions();
    return () => controller.abort();
  }, []);

  // Groups financial contributions by month so the chart can show the revenue progression over the semester.
  const chartData =
    contributions.length > 0
      ? Object.values(
          contributions.reduce(
            (acc: any, c: Contribution) => {
              if (c.TipoDoacao !== "Financeira") return acc;
              const date = new Date(c.DataContribuicao);
              if (isNaN(date.getTime())) return acc;

              const month = date.toLocaleString("pt-BR", {
                month: "short",
                year: "numeric",
              });

              if (!acc[month]) acc[month] = { month, desktop: 0 };
              acc[month].desktop += c.Quantidade;
              return acc;
            },
            {} as Record<string, { month: string; desktop: number }>,
          ),
        )
      : [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Arrecadação financeira</CardTitle>
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
          <CardTitle>Arrecadação financeira</CardTitle>
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
          <CardTitle>Arrecadação financeira</CardTitle>
          <CardDescription>Nenhum dado disponível</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Sem arrecadações registradas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Arrecadação financeira</CardTitle>
        <CardDescription>
          Período de arrecadações financeiras durante o semestre
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                value.charAt(0).toUpperCase() + value.slice(1)
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-primary)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Agosto 2025 - Atualmente
        </div>
      </CardFooter>
    </Card>
  );
}
