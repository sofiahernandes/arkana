// Tab wrapper used to organize the sign-up experience inside the registration screens.
"use client";

import React from "react";
import DropdownTurmas from "./dropdown-turmas";
import { isMockMode, registerMockUser } from "@/lib/mock-db";

interface Props {
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  setRaUsuario: React.Dispatch<React.SetStateAction<number>>;
}

export default function SigninTabs({ setIsLogged, setRaUsuario }: Props) {
  const [raAlunoMentor, setRaAlunoMentor] = React.useState("");
  const [telefoneAlunoMentor, setTelefoneAlunoMentor] = React.useState("");
  const [nomeAlunoMentor, setNomeAlunoMentor] = React.useState("");
  const [turma, setTurma] = React.useState("");
  const [emailAlunoMentor, setEmailAlunoMentor] = React.useState("");
  const [senhaAlunoMentor, setSenhaAlunoMentor] = React.useState("");
  const [mostrarSenha, setMostrarSenha] = React.useState(false);

  // Registers the participant and, on success, advances the onboarding flow to the team creation step.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        RaUsuario: Number(raAlunoMentor),
        NomeUsuario: nomeAlunoMentor,
        EmailUsuario: emailAlunoMentor,
        SenhaUsuario: senhaAlunoMentor,
        TelefoneUsuario: telefoneAlunoMentor,
        TurmaUsuario: turma,
      };
      if (isMockMode()) {
        registerMockUser(payload);
      } else {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
        const apiUrl = backendUrl.endsWith("/")
          ? `${backendUrl}api/register`
          : `${backendUrl}/api/register`;
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res
            .json()
            .catch(() => ({ error: "Erro desconhecido" }));
          console.error("Erro da API:", err);
          alert("Erro: " + (err.error || `Status ${res.status}`));
          return;
        }
      }
      setRaUsuario(Number(raAlunoMentor)); // State used on the sign team route
      setIsLogged(true); // Go to sign team page
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        alert("Erro de conexão. Verifique a configuração do app.");
      } else {
        alert("Erro ao cadastrar usuário: " + error);
      }
    }
  };
  return (
    <div className="mb-1 mt-1 mr-4 ml-4">
      <form onSubmit={handleSubmit}>
        <div className="text-base">
          Nome completo
          <input
            id="nome"
            name="nome"
            type="text"
            value={nomeAlunoMentor}
            onChange={(e) => setNomeAlunoMentor(e.target.value)}
            placeholder="Insira seu nome completo"
            className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-2 text-base focus:outline-none"
          />
        </div>

        <div className="text-base">
          Email Institucional
          <input
            id="email"
            name="email"
            type="email"
            value={emailAlunoMentor}
            onChange={(e) => setEmailAlunoMentor(e.target.value)}
            placeholder="Insira o email institucional"
            className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-2 text-base focus:outline-none"
          />
        </div>

        <div className="text-base">
          R.A do Aluno-mentor
          <input
            id="ra"
            name="ra"
            type="text"
            value={raAlunoMentor}
            onChange={(e) => setRaAlunoMentor(e.target.value)}
            placeholder="Insira seu R.A"
            className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-2 text-base focus:outline-none"
          />
        </div>

        <div className="text-base">
          <div className="flex flex-col space-y-2">
            Selecione sua turma
            <DropdownTurmas turma={turma} setTurma={setTurma} />
            Número de Celular
            <input
              id="telefone"
              name="telefone"
              type="string"
              value={telefoneAlunoMentor}
              onChange={(e) => setTelefoneAlunoMentor(e.target.value)}
              placeholder="Insira seu Número"
              className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-2 text-base focus:outline-none"
            />
          </div>

          <p className="mb-0">Crie uma senha</p>
          <div className="text-base flex">
            <input
              id="senha"
              name="senha"
              type={mostrarSenha ? "text" : "password"}
              value={senhaAlunoMentor}
              onChange={(e) => setSenhaAlunoMentor(e.target.value)}
              placeholder="Insira a senha"
              className="block w-[75%] mr-2 bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-2 text-base focus:outline-none"
            />
            <button
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="hidden rounded-lg"
            >
              {mostrarSenha ? (
                <img src="../assets/EyeClosed.png" />
              ) : (
                <img src="../assets/EyeOpen.png" />
              )}
            </button>
            <button
              type="submit"
              className="border-transparent bg-secondary hover:text-white! text-white text-base py-2 px-6 w-[90px] md:w-28 flex justify-content items-center hover:bg-secondary/80 rounded-lg"
            >
              Próxima
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
