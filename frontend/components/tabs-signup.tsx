// Tab wrapper used to organize the sign-up experience inside the registration screens.
"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";

import DropdownTurmas from "./dropdown-turmas";
import Field from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Registers the participant and, on success, advances the onboarding flow to the team creation step.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

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
          const body = await res.json().catch(() => null);
          console.error("Erro da API:", body);
          setError(
            body?.error ??
              body?.message ??
              `O servidor recusou o cadastro (status ${res.status}). Confira os dados e tente novamente.`,
          );
          return;
        }
      }
      setRaUsuario(Number(raAlunoMentor)); // State used on the sign team route
      setIsLogged(true); // Go to sign team page
    } catch (err) {
      console.error("Erro ao cadastrar usuário:", err);
      setError(
        err instanceof TypeError && err.message === "Failed to fetch"
          ? "Não foi possível falar com o servidor. Verifique sua conexão e tente novamente."
          : "Não foi possível concluir o cadastro. Tente novamente em instantes.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-4 my-1">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          label="Nome completo"
          name="nome"
          type="text"
          autoComplete="name"
          value={nomeAlunoMentor}
          onChange={(e) => setNomeAlunoMentor(e.target.value)}
          placeholder="Insira seu nome completo"
          required
        />

        <Field
          label="Email Institucional"
          name="email"
          type="email"
          autoComplete="email"
          value={emailAlunoMentor}
          onChange={(e) => setEmailAlunoMentor(e.target.value)}
          placeholder="Insira o email institucional"
          required
        />

        <Field
          label="R.A do Aluno-mentor"
          name="ra"
          type="text"
          inputMode="numeric"
          value={raAlunoMentor}
          onChange={(e) => setRaAlunoMentor(e.target.value)}
          placeholder="Insira seu R.A"
          required
        />

        <div className="space-y-1.5">
          {/* The trigger is a button, not a labelable control, so it is wired
              with aria-labelledby instead of htmlFor. */}
          <span id="turma-label" className="text-sm font-medium">
            Selecione sua turma
          </span>
          <DropdownTurmas
            turma={turma}
            setTurma={setTurma}
            labelledBy="turma-label"
          />
        </div>

        <Field
          label="Número de Celular"
          name="telefone"
          type="tel"
          autoComplete="tel"
          value={telefoneAlunoMentor}
          onChange={(e) => setTelefoneAlunoMentor(e.target.value)}
          placeholder="Insira seu Número"
          required
        />

        <div className="space-y-1.5">
          <Label htmlFor="field-senha">Crie uma senha</Label>
          <div className="flex gap-2">
            <Input
              id="field-senha"
              name="senha"
              type={mostrarSenha ? "text" : "password"}
              autoComplete="new-password"
              value={senhaAlunoMentor}
              onChange={(e) => setSenhaAlunoMentor(e.target.value)}
              placeholder="Insira a senha"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setMostrarSenha((visivel) => !visivel)}
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={mostrarSenha}
            >
              {mostrarSenha ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
            </Button>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="secondary"
          loading={submitting}
          className="self-end"
        >
          {submitting ? "Cadastrando…" : "Próxima"}
        </Button>
      </form>
    </div>
  );
}
