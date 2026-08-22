// Restricted team history page. Aggregates contribution history from the user team perspective.
"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import SwitchViewButton from "@/components/buttons/toggle";
import ContributionsGrid from "@/components/contributions/contributions-grid";
import ContributionsTable from "@/components/contributions/contributions-table";
import RecordsModal from "@/components/contributions/records-modal";
import PageHeader from "@/components/layout/page-header";
import PageShell from "@/components/layout/page-shell";
import { fetchData } from "@/hooks/fetch-user-profile";

const EMPTY_TITLE = "Nenhuma contribuição por enquanto!";
const EMPTY_DESCRIPTION =
  "Seu grupo ainda não arrecadou nenhuma doação. Quando o aluno líder adicionar ao Arkana, ela aparecerá aqui!";

export default function TeamHistory() {
  const params = useParams();
  const RaUsuario = Number(params.RaUsuario);
  const [team, setTeam] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [buttonSelected, setButtonSelected] = React.useState(false);
  const [selectedContribution, setSelectedContribution] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Loads the shared team/profile context once so both the heading and the history views use the same source of truth.
  useEffect(() => {
    // Fetches the participant and team metadata that frame the contribution history page.
    const fetchTeamData = async () => {
      const data = await fetchData(RaUsuario);
      setUser(data?.user);
      setTeam(data?.team);
    };
    fetchTeamData();
  }, [RaUsuario]);

  const openRecord = (contribution: any) => {
    setSelectedContribution(contribution);
    setIsOpen(true);
  };

  return (
    <PageShell nav={{ role: "user", id: String(RaUsuario) }}>
      <PageHeader
        title={team?.NomeTime ? `Histórico — ${team.NomeTime}` : "Histórico do time"}
        description={`Turma ${user?.TurmaUsuario ?? "—"}. Todas as contribuições registradas pelo seu grupo nesta edição.`}
        actions={
          <SwitchViewButton
            buttonSelected={buttonSelected}
            setButtonSelected={(arg: SetStateAction<boolean>) =>
              setButtonSelected(arg)
            }
          />
        }
      />

      {selectedContribution && (
        <RecordsModal
          data={selectedContribution}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          canDelete
          onDelete={() => {
            setIsOpen(false);
            setSelectedContribution(null);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}

      {buttonSelected ? (
        <ContributionsTable
          scope={String(RaUsuario)}
          emptyTitle={EMPTY_TITLE}
          emptyDescription={EMPTY_DESCRIPTION}
          refreshKey={refreshKey}
          onSelect={openRecord}
        />
      ) : (
        <ContributionsGrid
          scope={String(RaUsuario)}
          variant="team"
          emptyTitle={EMPTY_TITLE}
          emptyDescription={EMPTY_DESCRIPTION}
          refreshKey={refreshKey}
          onSelect={openRecord}
        />
      )}
    </PageShell>
  );
}
