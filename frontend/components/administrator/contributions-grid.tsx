// Administrator grid view for scanning contribution totals and statuses at a glance.
"use client";

import React, { useEffect, useState } from "react";
import { HandHeart } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { v4 as uuidv4 } from "uuid";
import { Contribution } from "./contributions-table/columns";
import { getMockContributions, isMockMode } from "@/lib/mock-db";
import Loading from "../loading";

interface RenderContributionProps {
  onSelect?: (contribution: Contribution) => void;
  refreshKey?: number;
  isPublicReport?: boolean;
}

type ContributionAdmin = Contribution & {
  PesoTotal?: number;
  PontuacaoTotal?: number;
  alimentos?: {
    NomeAlimento: string;
    Pontuacao?: number | string;
  }[];
};

export default function RenderContributionCardAdmin({
  onSelect,
  refreshKey = 0,
  isPublicReport = false,
}: RenderContributionProps) {
  const [contributions, setContributions] = useState<ContributionAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Loads the global contribution list used by the administrator card dashboard and the public report grid.
  useEffect(() => {
    const controller = new AbortController();
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    let active = true;

    // Normalizes mixed contribution payloads so the admin card view can stay independent from backend table names.
    async function fetchContributions() {
      try {
        setLoading(true);
        setError(null);
        if (isMockMode()) {
          setContributions(getMockContributions() as Contribution[]);
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

              // Builds the receipt object from either a stored upload path or a full external URL.
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
              };
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
              Nessa edição, nenhum grupo arrecadou doações. Quando os alunos
              líderes adicionarem ao Arkana, aparecerá aqui!
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="w-screen h-full text-center text-gray-600">
          <Loading />
        </div>
      )}

      {!loading && isPublicReport ? (
        <div className="md:mx-4 mb-15 grid grid-cols-1 md:grid-cols-3 gap-4.5 rounded-sm">
          {contributions.map((c) => (
            <div
              key={c.uuid}
              className="p-3 rounded-xl hover:bg-secondary/5 hover:text-secondary bg-white border border-gray-200 shadow-md transition-shadow duration-300 cursor-pointer"
              onClick={() => onSelect?.(c)}
            >
              <p className="font-semibold text-lg ">{c.NomeTime}</p>
              <p className="text-base text-gray-950">
                Data: {new Date(c.DataContribuicao).toLocaleDateString("pt-BR")}
              </p>
              <p className="text-base text-gray-950">
                Fonte da doação: {c.Fonte}
              </p>
              <p className="text-base text-gray-950">
                Ra do Aluno: {c.RaUsuario}
              </p>
              <p className="text-base text-gray-800">
                Tipo de Doação: {c.TipoDoacao}
              </p>
              <p className="text-base text-gray-800">
                Quantidade: {Intl.NumberFormat("pt-BR").format(c.Quantidade)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-15 grid grid-cols-1 md:grid-cols-3 gap-4 rounded-sm">
          {contributions.map((c) => (
            <div
              key={c.uuid}
              className="p-3 rounded-xl hover:bg-secondary/5 hover:text-secondary bg-white border border-gray-200 shadow-md transition-shadow duration-300 cursor-pointer"
              onClick={() => onSelect?.(c)}
            >
              <p className="font-semibold text-lg ">{c.NomeTime}</p>
              <p className="text-base text-gray-950">
                Data: {new Date(c.DataContribuicao).toLocaleDateString("pt-BR")}
              </p>
              <p className="text-base text-gray-950">
                Fonte da doação: {c.Fonte}
              </p>
              <p className="text-base text-gray-950">
                Ra do Aluno: {c.RaUsuario}
              </p>
              <p className="text-base text-gray-800">
                Tipo de Doação: {c.TipoDoacao}
              </p>
              <p className="text-base text-gray-800">
                Quantidade: {Intl.NumberFormat("pt-BR").format(c.Quantidade)}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
