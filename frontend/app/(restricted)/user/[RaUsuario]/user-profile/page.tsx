// Restricted user profile page. Loads the participant context and their current campaign metrics.
"use client";

import React, { SetStateAction, useEffect } from "react";
import { useParams } from "next/navigation";
import MenuMobile from "@/components/menu-mobile";
import MenuDesktop from "@/components/menu";
import { fetchData } from "@/hooks/fetch-user-profile";
import { Contribution } from "@/components/contributions-table/columns";
import {
  ensureMockMentorForUser,
  getMockContributions,
  getMockMentor,
  isMockMode,
} from "@/lib/mock-db";

export default function UserProfile() {
  const params = useParams();
  const RaUsuario = Number(params.RaUsuario);

  const [menuOpen, setMenuOpen] = React.useState(false);

  const [contributions, setContributions] = React.useState<Contribution[]>([]);
  const [emailMentor, setEmailMentor] = React.useState<string>();
  const [_, setIsSubmitting] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [team, setTeam] = React.useState<any>(null);

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Loads the user profile and their contributions together so the screen can render the team context and current campaign history.
  useEffect(() => {
    // Fetches the participant profile payload that also contains the assigned team information.
    const fetchTeamData = async () => {
      const data = await fetchData(RaUsuario);
      setUser(data?.user);
      setTeam(data?.team);
    };
    fetchTeamData();

    // Fetches the normalized contribution list shown in the profile metrics and history blocks.
    const fetchContributions = async () => {
      try {
        if (isMockMode()) {
          setContributions(getMockContributions(RaUsuario) as Contribution[]);
          return;
        }
        const res = await fetch(
          `${backend_url}/api/contributions/${RaUsuario}`,
        );
        if (!res.ok) return;
        setContributions(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchContributions();
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
      alert("Por favor, insira um email válido.");
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
      alert("Mentor adicionado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao salvar o mentor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container w-full pt-6 md:pt-16 pb-26 md:pb-16">
      <header className="w-full">
        <button
          className={`open-menu ${menuOpen ? "hidden" : "menu-icon"}`}
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>
      </header>

      <div className="page-container">
        <MenuDesktop menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <MenuMobile />

        <section className="md:max-w-6xl mx-auto h-150 gap-2 px-4">
          <div className="flex flex-col gap-2 text-center mb-8">
            <h3 className="text-2xl uppercase font-semibold text-primary ">
              Informações sobre o time {team?.NomeTime && team?.NomeTime}
            </h3>
            <h4 className="text-xl text-primary/80">
              Turma {user?.TurmaUsuario ? user?.TurmaUsuario : "X"}
            </h4>
          </div>

          <div className="flex flex-col gap-4 p-4 md:p-6 border rounded-xl bg-white border-gray-200 shadow-md">
            <div>
              <p className="font-semibold">Email Mentor</p>
              <div className="block min-h-9 border rounded-md border-gray-200 px-2 w-full text-black placeholder-gray-400 pt-1 text-base focus:outline-none overflow-hidden">
                {team?.IdMentor ? (
                  <p className="break-words break-all">{emailMentor}</p>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="flex justify-between"
                  >
                    <input
                      type="text"
                      onChange={(e) => setEmailMentor(e.target.value)}
                      value={emailMentor || ""}
                      placeholder="Adicione aqui o Mentor de seu time!"
                      className="w-[85%] h-full focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="underline text-blue-700 h-full"
                    >
                      <img
                        className="text-primary w-6 opacity-60 rotate-180 hover:opacity-70"
                        src="https://img.icons8.com/glyph-neue/64/circled-left-2.png"
                        alt="circled-left-2"
                      />
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div>
              <p className="font-semibold">Aluno-Mentor</p>
              <p className="block w-full min-h-9 border rounded-md border-gray-200 px-2 text-black placeholder-gray-400 py-1 text-base focus:outline-none overflow-hidden break-words break-all">
                {user?.RaUsuario
                  ? user?.NomeUsuario
                  : "Nome do Usuario aparecerá aqui"}
              </p>
            </div>

            <div>
              <p className="font-semibold"> Integrantes do grupo </p>
              <div className="border border-gray-200 rounded-md h-full py-1 px-2 max-w-50">
                {team?.RaAlunos?.length > 0
                  ? team.RaAlunos.map((RA: number, index: number) => (
                      <p key={index} className=" mb-1 font-medium">
                        {RA}
                      </p>
                    ))
                  : "RAs dos alunos aparecerão aqui"}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
