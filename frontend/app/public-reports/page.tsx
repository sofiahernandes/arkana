// Public reports page that focuses on the read-only donation dashboards and charts.
"use client";

import React, { useState } from "react";

import BackHome from "@/components/buttons/back";
import ContributionsGrid from "@/components/contributions/contributions-grid";
import RecordsModal from "@/components/contributions/records-modal";
import PageHeader from "@/components/layout/page-header";
import PageShell from "@/components/layout/page-shell";

import { BiggestContributionsChart } from "@/components/reports-charts/tooltip-chart/page";
import { FinanContribuitionsChart } from "@/components/reports-charts/area-chart/page";
import { TeamsRankingChart } from "@/components/reports-charts/bar-label-costum/page";

export default function PublicReports() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedContribution, setSelectedContribution] =
    React.useState<any>(null);

  return (
    <PageShell ground="background">
      <div className="mb-4">
        <BackHome />
      </div>

      <PageHeader
        title="Relatórios da campanha"
        description="Resultados abertos de todos os grupos: contribuições registradas, evolução da arrecadação e ranking dos times."
      />

      {selectedContribution && (
        <RecordsModal
          data={selectedContribution}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* The contribution list is the subject; the charts read alongside it. */}
        <div className="lg:col-span-2">
          <ContributionsGrid
            scope="all"
            variant="report"
            emptyTitle="Nenhuma contribuição por enquanto!"
            emptyDescription="Nessa edição, nenhum grupo arrecadou doações. Quando os alunos líderes adicionarem ao Arkana, aparecerá aqui!"
            onSelect={(contribution: any) => {
              setSelectedContribution(contribution);
              setIsOpen(true);
            }}
          />
        </div>

        <div className="flex flex-col gap-6">
          <BiggestContributionsChart />
          <FinanContribuitionsChart />
          <TeamsRankingChart />
        </div>
      </div>
    </PageShell>
  );
}
