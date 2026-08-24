// Shared contribution loader. `"all"` reads every contribution (admin/report views),
// a RA string reads a single participant's history.
"use client";

import { useCallback, useEffect, useState } from "react";

import {
  normalizeContributions,
  type Contribution,
} from "@/lib/normalize-contributions";
import { getMockContributions, isMockMode } from "@/lib/mock-db";

export type ContributionScope = "all" | string;

export function useContributions(scope: ContributionScope) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
      const url =
        scope === "all"
          ? `${backend_url}/api/contributions`
          : `${backend_url}/api/contributions/${scope}`;

      try {
        setLoading(true);
        setError(null);
        // Mock data is already stored in the normalized shape.
        if (isMockMode()) {
          const ra = scope === "all" ? undefined : Number(scope);
          setContributions(
            getMockContributions(
              Number.isFinite(ra as number) ? (ra as number) : undefined,
            ) as Contribution[],
          );
          return;
        }

        const res = await fetch(url, { cache: "no-store", signal });
        if (!res.ok) throw new Error("Erro ao buscar contribuições");
        const raw = await res.json();
        if (signal?.aborted) return;

        setContributions(normalizeContributions(raw));
      } catch (err: any) {
        if (err?.name === "AbortError") {
          return;
        }
        setError(err?.message ?? "Erro inesperado");
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [scope],
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const refetch = useCallback(() => {
    load();
  }, [load]);

  return { contributions, loading, error, refetch };
}
