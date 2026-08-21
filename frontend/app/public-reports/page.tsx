// Public reports page that focuses on the read-only donation dashboards and charts.
"use client";

import React, { useState } from "react";
import BackHome from "@/components/buttons/back";
import RecordsMentor from "@/components/administrator/records-mentor";
import RenderContributionCard from "@/components/administrator/contributions-grid";
import Loading from "@/components/loading";

import { BiggestContributionsChart } from "@/components/reports-charts/tooltip-chart/page";
import { FinanContribuitionsChart } from "@/components/reports-charts/area-chart/page";
import { TeamsRankingChart } from "@/components/reports-charts/bar-label-costum/page";

// Derives the semester edition labels from the base edition/year so the report selector stays current without manual updates.
function generateEditions(startEdition = 7, startYear = 2025) {
  const editions = [];
  const currentDate = new Date();
  const yearDiff = currentDate.getFullYear() - startYear;
  const currentEdition =
    startEdition + yearDiff * 2 + (currentDate.getMonth() >= 7 ? 1 : 0);

  for (let ed = startEdition; ed <= currentEdition + 1; ed++) {
    const baseYear = startYear + Math.floor((ed - startEdition) / 2);
    const isFirstSemester = ed % 2 === 1;
    const period = isFirstSemester
      ? `Jan - Jul ${baseYear}`
      : `Ago - Dez ${baseYear}`;
    editions.push({
      value: ed,
      label: `${ed}ª Edição (${period})`,
    });
  }
  return editions;
}

export default function PublicReports() {
  const [edition, setEdition] = useState<number>(() => {
    // Starts the reports view on the edition that matches the current semester.
    const now = new Date();
    const startEdition = 7;
    const startYear = 2025;
    const yearDiff = now.getFullYear() - startYear;
    const currentEdition =
      startEdition + yearDiff * 2 + (now.getMonth() >= 7 ? 1 : 0);
    return currentEdition;
  });

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedContribution, setSelectedContribution] =
    React.useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prepares the available edition labels for the report filters and future navigation work.
  const editions = generateEditions();

  return (
    <div className="min-h-screen w-screen bg-background p-6">
      <div className="absolute left-0 top-0 m-4">
        <BackHome />
      </div>

      <div className="mx-auto mt-5 grid grid-cols-1 md:grid-cols-3">
        <div className="w-full h-full md:col-span-2">
          {loading && (
            <div className="w-screen h-full text-center text-gray-600">
              <Loading />
            </div>
          )}

          {!loading && !error && (
            <div className="w-full overflow-y-hidden overflow-x-hidden flex flex-col">
              <div className="*:w-full flex justify-center pt-4 transition-all duration-300 ease-in-out">
                <main className="w-full ">
                  {selectedContribution && (
                    <RecordsMentor
                      data={selectedContribution}
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                    />
                  )}

                  <div className="mt-2">
                    <RenderContributionCard
                      isPublicReport
                      onSelect={(contribution: any) => {
                        setSelectedContribution(contribution);
                        setIsOpen(true);
                      }}
                    />
                  </div>
                </main>
              </div>
            </div>
          )}
        </div>

        <div className="w-full h-full flex flex-col gap-6">
          <BiggestContributionsChart />
          <FinanContribuitionsChart />
          <TeamsRankingChart />
        </div>
      </div>
    </div>
  );
}
