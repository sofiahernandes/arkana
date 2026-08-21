// Single source of truth for turning the mixed financial/food contribution payload
// into the shape every contribution view (table, grid, modal, charts) renders.
// The field mappings, fallbacks and coercions below are the ones that used to be
// copy-pasted into each component — behavior is intentionally unchanged.
import { v4 as uuidv4 } from "uuid";

export type Contribution = {
  IdContribuicao: number;
  RaUsuario: number;
  TipoDoacao: string;
  Quantidade: number;
  Meta?: number;
  Gastos?: number;
  Fonte?: string;
  comprovante?: {
    IdComprovante: number;
    Imagem: string;
  };
  DataContribuicao: string;
  NomeAlimento?: string;
  PontuacaoAlimento?: number;
  NomeTime: string;
  PesoUnidade: number;
  PesoTotal?: number;
  PontuacaoTotal?: number;
  uuid: string;
  alimentos?: {
    NomeAlimento: string;
    Pontuacao?: number;
  }[];
};

// Backend numbers arrive as pt-BR strings ("1.234,50") or as plain numbers.
function toNumber(value: unknown) {
  return Number(String(value).replace(/\./g, "").replace(",", "."));
}

export function normalizeContributions(raw: unknown): Contribution[] {
  if (!Array.isArray(raw)) return [];

  return raw.map((r: any) => {
    const quantidade = toNumber(r.Quantidade);

    const pesoUnidade = r.PesoUnidade != null ? toNumber(r.PesoUnidade) : 0;

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

    const idComp = r?.comprovante?.IdComprovante ?? r?.IdComprovante ?? null;

    const rawImg =
      r?.Comprovante ??
      r?.comprovante?.Imagem ??
      r?.Comprovante?.Imagem ??
      r?.Imagem ??
      r?.comprovantes?.[0]?.Imagem ??
      r?.UrlComprovante ??
      null;

    let comprovante: { IdComprovante: number; Imagem: string } | undefined;

    // Builds a single receipt URL shape regardless of whether the backend
    // returned a stored filename or a full external URL.
    if (rawImg && String(rawImg).trim() !== "") {
      const s = String(rawImg).trim();
      const isAbsolute = /^https?:\/\//i.test(s);
      const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(
        /\/$/,
        "",
      );
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
      Meta: r.Meta != null ? toNumber(r.Meta) : undefined,
      Gastos: r.Gastos != null ? toNumber(r.Gastos) : undefined,
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
    } satisfies Contribution;
  });
}
