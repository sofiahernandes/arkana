// Grid-style contribution summary component used where card-based comparison is clearer than a table.
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { HandHeart } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import formatBRL from "../hooks/use-format-currency";
import { v4 as uuidv4 } from "uuid";
import { Contribution } from "./contributions-table/columns";
import Loading from "./loading";
import { getMockContributions, isMockMode } from "@/lib/mock-db";

interface RenderContributionProps {
  raUsuario?: number;
  onSelect?: (contribution: ContributionAdmin) => void;
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

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function RenderContributionCard({
  raUsuario,
  onSelect,
  refreshKey = 0,
}: RenderContributionProps) {
  const [contributions, setContributions] = useState<ContributionAdmin[]>([]);
  const params = useParams();
  const raFromParams = params?.RaUsuario ? Number(params.RaUsuario) : undefined;
  const RaUsuario =
    typeof raUsuario === "number" && Number.isFinite(raUsuario)
      ? raUsuario
      : typeof raFromParams === "number" && Number.isFinite(raFromParams)
        ? raFromParams
        : undefined;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Loads the current user's contributions and reshapes them for the card-based history view.
  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    // Reuses the same normalization rules as the table view so both participant history layouts stay aligned.
    async function fetchContributions() {
      try {
        setLoading(true);
        setError(null);
        if (isMockMode()) {
          const raw = getMockContributions(RaUsuario);
          setContributions(raw as ContributionAdmin[]);
          return;
        }

        const res = await fetch(
          `${backend_url}/api/contributions/${RaUsuario}`,
          {
            cache: "no-store",
            signal: controller.signal,
          },
        );

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

              // Converts receipt filenames and absolute URLs into one frontend-ready receipt object.
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
  }, [RaUsuario, refreshKey]);

  if (contributions.length === 0) {
    return (
      <div className="col-start-2 border rounded-xl border-gray-200 shadow-md w-auto max-w-100 mx-auto">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HandHeart size={44} strokeWidth={1.2} />
            </EmptyMedia>
            <EmptyTitle>Nenhuma contribuição por enquanto!</EmptyTitle>
            <EmptyDescription>
              Seu grupo ainda não arrecadou nenhuma doação. Quando o aluno líder
              adicionar ao Arkana, ela aparecerá aqui!
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="mb-15 grid grid-cols-1 md:grid-cols-3 gap-4">
      {loading && (
        <div className="w-screen h-full text-center text-gray-600">
          <Loading />
        </div>
      )}

      {!loading &&
        !error &&
        contributions.map((c, index) => (
          <div
            key={`contribuicao-${c.uuid}-${index}`}
            className="p-3 rounded-xl hover:bg-secondary/5 hover:text-secondary bg-white border border-gray-200 shadow-md transition-shadow duration-300 cursor-pointer"
            onClick={() => onSelect?.(c)}
          >
            <p className="font-semibold text-lg ">{c.Fonte}</p>
            <p className="text-base text-gray-950">
              Data: {new Date(c.DataContribuicao).toLocaleDateString("pt-BR")}
            </p>
            <p className="text-base text-gray-800">
              Tipo de Doação: {c.TipoDoacao}
            </p>
            <p className="text-base text-gray-800">
              Quantidade: {Intl.NumberFormat("pt-BR").format(c.Quantidade)}
            </p>
            <p className="text-base text-gray-800">
              Gastos: {formatBRL(c.Gastos)}
            </p>
          </div>
        ))}
    </div>
  );
}
