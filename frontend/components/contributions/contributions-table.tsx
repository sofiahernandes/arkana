// Contribution table used by both the participant history and the administrator overview.
"use client";

import React, { useEffect, useMemo } from "react";
import { HandHeart } from "lucide-react";

import { DataTable } from "@/components/contributions/data-table";
import { buildContributionColumns } from "@/components/contributions/columns";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { LoadingPanel } from "@/components/layout/state-panel";
import { useContributions } from "@/hooks/use-contributions";
import type { Contribution } from "@/lib/normalize-contributions";

interface ContributionsTableProps {
  /** `"all"` for every group, or a participant RA. */
  scope: "all" | string;
  showTeamColumn?: boolean;
  emptyTitle: string;
  emptyDescription: string;
  onSelect?: (contribution: Contribution) => void;
  refreshKey?: number;
}

export default function ContributionsTable({
  scope,
  showTeamColumn = false,
  emptyTitle,
  emptyDescription,
  onSelect,
  refreshKey = 0,
}: ContributionsTableProps) {
  const { contributions, loading, refetch } = useContributions(scope);

  // Keeps the row actions stable while still letting the parent inject the record viewer callback.
  const columns = useMemo(
    () =>
      buildContributionColumns({
        onView: (c) => onSelect?.(c),
        showTeamColumn,
      }),
    [onSelect, showTeamColumn],
  );

  // The parent bumps refreshKey after a delete so the list reloads.
  useEffect(() => {
    if (refreshKey > 0) refetch();
  }, [refreshKey, refetch]);

  if (loading) {
    return <LoadingPanel label="Carregando contribuições…" rows={5} />;
  }

  if (!contributions.length) {
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
          <EmptyContent />
        </Empty>
      </div>
    );
  }

  return (
    <div className="p-2">
      <DataTable<Contribution, unknown>
        columns={columns}
        data={contributions}
        // The team column only exists in the admin view, so it drives the search box too.
        filterColumn={showTeamColumn ? "NomeTime" : "Fonte"}
        filterPlaceholder={
          showTeamColumn
            ? "Procurar nome de um grupo..."
            : "Procurar fonte da doação..."
        }
      />
    </div>
  );
}
