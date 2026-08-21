// Restricted administrator history page. Presents the broader contribution history used by admins.
"use client";

import React, { SetStateAction } from "react";
import { useParams } from "next/navigation";

import SwitchViewButton from "@/components/buttons/toggle";
import ContributionsGrid from "@/components/contributions/contributions-grid";
import ContributionsTable from "@/components/contributions/contributions-table";
import RecordsModal from "@/components/contributions/records-modal";
import PageHeader from "@/components/layout/page-header";
import PageShell from "@/components/layout/page-shell";

const EMPTY_TITLE = "Nenhuma contribuição por enquanto!";
const EMPTY_DESCRIPTION =
  "Nessa edição, nenhum grupo arrecadou doações. Quando os alunos líderes adicionarem ao Arkana, aparecerá aqui!";

export default function AdminPageVision() {
  const params = useParams();
  const IdMentor = String(params.IdMentor ?? "");

  const [isOpen, setIsOpen] = React.useState(false);
  const [buttonSelected, setButtonSelected] = React.useState(false);
  const [selectedContribution, setSelectedContribution] =
    React.useState<any>(null);

  const openRecord = (contribution: any) => {
    setSelectedContribution(contribution);
    setIsOpen(true);
  };

  return (
    <PageShell nav={{ role: "admin", id: IdMentor }}>
      <PageHeader
        title="Histórico de contribuições"
        description="Todas as arrecadações registradas por todos os grupos nesta edição da campanha."
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
        />
      )}

      {buttonSelected ? (
        <ContributionsTable
          scope="all"
          showTeamColumn
          emptyTitle={EMPTY_TITLE}
          emptyDescription={EMPTY_DESCRIPTION}
          onSelect={openRecord}
        />
      ) : (
        <ContributionsGrid
          scope="all"
          variant="report"
          emptyTitle={EMPTY_TITLE}
          emptyDescription={EMPTY_DESCRIPTION}
          onSelect={openRecord}
        />
      )}
    </PageShell>
  );
}
