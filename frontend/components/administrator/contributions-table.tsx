// Administrator-facing contribution table with broader visibility than the participant version.
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { HandHeart as HandHeart } from "lucide-react";
import { DataTable } from "@/components/administrator/contributions-table/data-table";
import {
  makeContributionColumns,
  type Contribution,
} from "@/components/administrator/contributions-table/columns";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getMockContributions, isMockMode } from "@/lib/mock-db";

interface RenderContributionProps {
  onSelect?: (contribution: Contribution) => void;
  refreshKey?: number;
}

type ContributionAdmin = Contribution & {
  PesoTotal?: number;
  PontuacaoTotal?: number;
  alimentos?: {
    NomeAlimento: string;
    Pontuacao?: number | string;
  }[];
};

export default function RenderContributionTableAdmin({
  onSelect,
  refreshKey = 0,
}: RenderContributionProps) {
  const [contributions, setContributions] = useState<ContributionAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [_, setError] = useState<string | null>(null);

  // Keeps the admin row actions stable while still allowing the parent modal opener to be injected.
  const columns = useMemo(
    () =>
      makeContributionColumns({
        onView: (c) => onSelect?.(c),
      }),
    [onSelect],
  );

  // Fetches and normalizes every contribution whenever the admin view needs a fresh dataset.
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Converts the backend payload into the broader admin table model, including calculated food totals.
    async function fetchContributions() {
      try {
        setLoading(true);
        setError(null);
        if (isMockMode()) {
          setContributions(getMockContributions() as ContributionAdmin[]);
          return;
        }
        const res = await fetch(`${backend_url}/api/contributions`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Erro ao buscar contribuições");
        const raw = await res.json();
        if (!active) return;

        const data: ContributionAdmin[] = Array.isArray(raw)
          ? raw.map((r: any) => {
              const quantidade = Number(
                String(r.Quantidade).replace(/\./g, "").replace(",", "."),
              );

              const pesoUnidade =
                r.PesoUnidade != null
                  ? Number(
                      String(r.PesoUnidade)
                        .replace(/\./g, "")
                        .replace(",", "."),
                    )
                  : 0;
              const pesoTotal =
                Number.isFinite(quantidade) && Number.isFinite(pesoUnidade)
                  ? quantidade * pesoUnidade
                  : undefined;

              const pontTotal = Array.isArray(r.alimentos)
                ? r.alimentos.reduce((sum: number, a: any) => {
                    const pontuacao = Number(a.Pontuacao ?? 0);
                    return sum + pontuacao * quantidade;
                  }, 0)
                : 0;

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

              // Standardizes receipt URLs so the table can preview uploads regardless of the storage format returned.
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
                Quantidade: quantidade,
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
                NomeTime: r.NomeTime ?? undefined,
                PesoTotal: pesoTotal ?? 0,
                PontuacaoTotal: pontTotal ?? 0,
                PesoUnidade: pesoUnidade,
                uuid: r.uuid ?? uuidv4(),

                alimentos: Array.isArray(r.alimentos)
                  ? r.alimentos.map((a: any) => ({
                      NomeAlimento: a.NomeAlimento ?? "",
                      Pontuacao: Number(a.Pontuacao ?? 0),
                    }))
                  : [],
              } satisfies ContributionAdmin;
            })
          : [];
        setContributions(data);
      } catch (err: any) {
        if (err?.name === "AbortError") {
          return;
        }
        setError(err?.message ?? "Erro inesperado");
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchContributions();
    return () => {
      active = false;
      controller.abort();
    };
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse text-sm text-muted-foreground">
          Carregando contribuições…
        </div>
      </div>
    );
  }

  if (!contributions.length) {
    return (
      <div className="col-start-2 border rounded-xl border-gray-200 shadow-md w-auto max-w-100 mx-auto">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HandHeart size={44} strokeWidth={1.2} />
            </EmptyMedia>
            <EmptyTitle>Nenhuma contribuição por enquanto!</EmptyTitle>
            <EmptyDescription>
              Nessa edição, nenhum grupo arrecadou doações. Quando os alunos
              líderes adicionarem ao Arkana, aparecerá aqui!
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent />
        </Empty>
      </div>
    );
  }

  return (
    <div className="p-2">
      <DataTable<ContributionAdmin, unknown>
        columns={columns}
        data={contributions}
      />
    </div>
  );
}
