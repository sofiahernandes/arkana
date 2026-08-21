// Restricted mentor history page. Shows the mentor-specific contribution history and summary views.
"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import BackHome from "@/components/buttons/back";
import SwitchViewButton from "@/components/buttons/toggle";
import ContributionsGrid from "@/components/contributions/contributions-grid";
import ContributionsTable from "@/components/contributions/contributions-table";
import RecordsModal from "@/components/contributions/records-modal";
import PageHeader from "@/components/layout/page-header";
import PageShell from "@/components/layout/page-shell";
import { ErrorPanel, LoadingPanel } from "@/components/layout/state-panel";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { getMockUser, getMockMentorTeam, isMockMode } from "@/lib/mock-db";

const EMPTY_TITLE = "Nenhuma contribuição por enquanto!";
const EMPTY_DESCRIPTION =
  "Seu grupo ainda não arrecadou nenhuma doação. Quando o aluno líder adicionar ao Arkana, ela aparecerá aqui!";

interface TeamData {
  IdTime: number;
  NomeTime: string;
  RaUsuario: number | null;
}
const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function MentorVision() {
  const params = useParams();
  const IdMentor = params?.IdMentor ? Number(params.IdMentor) : null;
  const [team, setTeam] = useState<TeamData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [buttonSelected, setButtonSelected] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<any>(null);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [errorTeam, setErrorTeam] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [errorUser, setErrorUser] = useState<string | null>(null);

  // Resolves the mentor's team from the route param so the page can scope all later contribution queries correctly.
  useEffect(() => {
    if (!IdMentor) {
      console.warn("invalido", params);
      return;
    }

    const controller = new AbortController();
    let active = true;

    // Fetches the single team supervised by the mentor and stores only the shape this screen needs.
    async function fetchMentorTeam() {
      try {
        setLoadingTeam(true);
        setErrorTeam(null);
        if (isMockMode()) {
          const mock =
            getMockMentorTeam(2024001, IdMentor ?? 0) ||
            getMockMentorTeam(2024002, IdMentor ?? 0);
          if (!active) return;
          setTeam(mock?.team ?? null);
          return;
        }

        const res = await fetch(`${backend_url}/api/mentor/${IdMentor}/team`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(`Falha ao buscar time (${res.status}) ${msg}`);
        }
        const mentorData = await res.json();
        const oneTeam: TeamData | null = Array.isArray(mentorData)
          ? (mentorData[0] ?? null)
          : (mentorData as TeamData | null);

        if (!active) return;

        setTeam(oneTeam);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("Erro ao buscar time do mentor:", err);
        setErrorTeam(err?.message ?? "Erro ao buscar time do mentor");
      } finally {
        if (active) setLoadingTeam(false);
      }
    }
    fetchMentorTeam();

    return () => {
      active = false;
      controller.abort();
    };
  }, [IdMentor]);

  // Loads the participant profile only after the team lookup reveals which student leads that group.
  useEffect(() => {
    const ra = team?.RaUsuario;
    if (!backend_url) return;
    if (!ra || !Number.isFinite(ra)) {
      setUser(null);
      return;
    }

    const controller = new AbortController();
    let active = true;

    // Fetches the user details used to render the class information above the contribution history.
    async function fetchUser() {
      try {
        setLoadingUser(true);
        setErrorUser(null);
        if (isMockMode()) {
          setUser(getMockUser(ra ?? 0));
          return;
        }

        const res = await fetch(`${backend_url}/api/user/${ra}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Falha ao buscar usuário (${res.status})`);
        const userData = await res.json();
        if (!active) return;

        setUser(userData);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("Erro ao buscar usuário:", err);
        setErrorUser(err?.message ?? "Erro ao buscar usuário");
      } finally {
        if (active) setLoadingUser(false);
      }
    }

    fetchUser();
    return () => {
      active = false;
      controller.abort();
    };
  }, [team?.RaUsuario]);

  const raUsuario =
    team?.RaUsuario && Number.isFinite(team.RaUsuario)
      ? team.RaUsuario
      : undefined;

  const openRecord = (contribution: any) => {
    setSelectedContribution(contribution);
    setIsOpen(true);
  };

  return (
    <PageShell>
      <div className="mb-4">
        <BackHome />
      </div>

      <PageHeader
        title={
          loadingTeam
            ? "Carregando time…"
            : team?.NomeTime || "Nenhum time encontrado"
        }
        description={
          loadingUser
            ? "Carregando turma…"
            : `Turma ${user?.TurmaUsuario || "—"}. Contribuições do grupo que você acompanha.`
        }
        actions={
          raUsuario !== undefined ? (
            <SwitchViewButton
              buttonSelected={buttonSelected}
              setButtonSelected={(arg: SetStateAction<boolean>) =>
                setButtonSelected(arg)
              }
            />
          ) : undefined
        }
      />

      {selectedContribution && (
        <RecordsModal
          data={selectedContribution}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}

      {(errorTeam || errorUser) && (
        <ErrorPanel
          title="Não foi possível carregar o time"
          description={errorTeam ?? errorUser ?? undefined}
        />
      )}

      {!errorTeam && loadingTeam && (
        <LoadingPanel label="Carregando contribuições do time…" rows={3} />
      )}

      {/* Wait for the RA before querying. Previously this rendered immediately
          and requested /api/contributions/undefined. */}
      {!errorTeam && !loadingTeam && raUsuario === undefined && (
        <Empty className="border border-dashed border-border">
          <EmptyHeader>
            <EmptyTitle>Nenhum time vinculado</EmptyTitle>
            <EmptyDescription>
              Você ainda não acompanha um grupo nesta edição. Assim que um time
              informar seu email, o histórico aparecerá aqui.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {raUsuario !== undefined &&
        (buttonSelected ? (
          <ContributionsTable
            scope={String(raUsuario)}
            emptyTitle={EMPTY_TITLE}
            emptyDescription={EMPTY_DESCRIPTION}
            onSelect={openRecord}
          />
        ) : (
          <ContributionsGrid
            scope={String(raUsuario)}
            variant="team"
            emptyTitle={EMPTY_TITLE}
            emptyDescription={EMPTY_DESCRIPTION}
            onSelect={openRecord}
          />
        ))}
    </PageShell>
  );
}
