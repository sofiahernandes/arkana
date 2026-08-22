// Restricted user profile page. Loads the participant context and their current campaign metrics.
"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import Field from "@/components/forms/field";
import PageHeader from "@/components/layout/page-header";
import PageShell from "@/components/layout/page-shell";
import { InfoList, InfoRow } from "@/components/layout/info-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchData } from "@/hooks/fetch-user-profile";
import { ensureMockMentorForUser, getMockMentor, isMockMode } from "@/lib/mock-db";

export default function UserProfile() {
  const params = useParams();
  const RaUsuario = Number(params.RaUsuario);

  const [emailMentor, setEmailMentor] = React.useState<string>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [team, setTeam] = React.useState<any>(null);

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Loads the participant profile payload that also contains the assigned team information.
  useEffect(() => {
    const fetchTeamData = async () => {
      const data = await fetchData(RaUsuario);
      setUser(data?.user);
      setTeam(data?.team);
    };
    fetchTeamData();
  }, [RaUsuario]);

  // Resolves the mentor email only after the team data reveals which mentor is linked to the current group.
  useEffect(() => {
    // Keeps the mentor contact field in sync with either mock data or the backend mentor lookup endpoint.
    const fetchEmailMentor = async () => {
      if (!team?.IdMentor) return;
      try {
        if (isMockMode()) {
          const mentor = getMockMentor(team.IdMentor);
          if (mentor) setEmailMentor(mentor.EmailMentor);
          return;
        }
        const res = await fetch(`${backend_url}/api/mentor/${team.IdMentor}`);
        const emailM = await res.json();
        if (res.ok) setEmailMentor(emailM.EmailMentor);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmailMentor();
  }, [team?.IdMentor]);

  // Creates or links a mentor for the current team and then updates local state so the page reflects the new assignment immediately.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailMentor?.trim()) {
      toast.error("Informe o email do mentor para continuar.");
      return;
    }
    setIsSubmitting(true);

    try {
      const MentorData = isMockMode()
        ? ensureMockMentorForUser(RaUsuario, emailMentor)
        : await fetch(`${backend_url}/api/createMentor/${RaUsuario}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              EmailMentor: emailMentor,
              RaUsuario: RaUsuario,
            }),
          }).then(async (response) => {
            if (!response.ok) {
              throw new Error("Erro ao salvar o mentor no banco de dados.");
            }
            return response.json();
          });
      setTeam((prevTeam: any) => ({
        ...prevTeam,
        IdMentor: MentorData.IdMentor,
      }));
      toast.success("Mentor vinculado ao time.");
    } catch (error) {
      console.error(error);
      toast.error(
        "Não foi possível vincular o mentor. Confira o email e tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell nav={{ role: "user", id: String(RaUsuario) }}>
      <PageHeader
        title={team?.NomeTime ? `Time ${team.NomeTime}` : "Meu time"}
        description={`Turma ${user?.TurmaUsuario ?? "—"}. Estes são os dados do seu grupo nesta edição da campanha.`}
      />

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Informações do time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <InfoList>
            <InfoRow label="Aluno-mentor" empty="Ainda não informado">
              {user?.NomeUsuario}
            </InfoRow>
            <InfoRow label="Integrantes do grupo" empty="Nenhum RA cadastrado">
              {team?.RaAlunos?.length > 0 && (
                <ul className="space-y-0.5">
                  {team.RaAlunos.map((RA: number) => (
                    <li key={RA} className="font-medium tabular-nums">
                      {RA}
                    </li>
                  ))}
                </ul>
              )}
            </InfoRow>
            {team?.IdMentor && (
              <InfoRow label="Mentor" empty="Ainda não informado">
                {emailMentor}
              </InfoRow>
            )}
          </InfoList>

          {/* The mentor is assigned once. After that it is read-only above. */}
          {!team?.IdMentor && (
            <form
              onSubmit={handleSubmit}
              className="space-y-3 rounded-md border border-border bg-muted/60 p-4"
            >
              <Field
                label="Mentor do time"
                name="EmailMentor"
                type="email"
                hint="O mentor recebe acesso ao histórico de contribuições do seu grupo."
                placeholder="mentor@exemplo.com"
                value={emailMentor ?? ""}
                onChange={(e) => setEmailMentor(e.target.value)}
                required
              />
              <Button type="submit" loading={isSubmitting}>
                Vincular mentor
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
