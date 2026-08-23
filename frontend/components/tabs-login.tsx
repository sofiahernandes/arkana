// Tab wrapper used by the login screen to keep authentication variants in one place.
"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import CustomInputs from "./login-user-inputs";
import MentorInputs from "./administrator/login-forms";
import { useRouter } from "next/navigation";
import {
  ensureMockAdminForUser,
  isMockMode,
  loginMockMentor,
  loginMockUser,
} from "@/lib/mock-db";

/** All three tabs are the same card with a different set of fields. */
function LoginCard({
  title,
  onSubmit,
  submitting,
  error,
  children,
}: {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  error: string | null;
  children: React.ReactNode;
}) {
  // No border, shadow or fill: this sits inside AuthShell's card already, and a
  // card inside a card is always wrong.
  return (
    <section className="flex h-full w-full flex-col justify-center pt-6">
      <h2 className="mb-6 text-center text-xl font-semibold text-primary">
        {title}
      </h2>
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
        {children}

        {error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="secondary"
          loading={submitting}
          className="self-center"
        >
          {submitting ? "Entrando…" : "Entrar"}
        </Button>
      </form>
    </section>
  );
}

/** Turns any thrown value into something the person at the keyboard can act on. */
function describeLoginError(error: unknown) {
  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return "Não foi possível falar com o servidor. Verifique sua conexão e tente novamente.";
  }
  if (error instanceof Error && error.message) return error.message;
  return "Não foi possível entrar. Confira seus dados e tente novamente.";
}

export default function TabsLogin() {
  const router = useRouter();
  const [_, setIdMentor] = React.useState<number>();
  const [EmailMentor, setEmailMentor] = React.useState("");
  const [SenhaMentor, setSenhaMentor] = React.useState("");
  const [RaUsuario, setRaUsuario] = React.useState("2024001");
  const [SenhaUsuario, setSenhaUsuario] = React.useState("123@Arkana");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  /** Reads the API's own message so the user sees why the login was refused. */
  async function readApiError(res: Response) {
    const body = await res.json().catch(() => null);
    return (
      body?.error ??
      body?.message ??
      `O servidor recusou o login (status ${res.status}). Tente novamente em instantes.`
    );
  }

  // Login Student
  // Logs in a participant and routes them straight to the contribution creation area for their own profile.
  const handleSubmitAluno = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (isMockMode()) {
        loginMockUser(parseInt(RaUsuario), SenhaUsuario);
        router.push(`/user/${RaUsuario}/new-contribution`);
        return;
      }
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await fetch(`${backendUrl}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          RaUsuario: parseInt(RaUsuario),
          SenhaUsuario,
        }),
      });
      if (!res.ok) {
        setError(await readApiError(res));
        return;
      }
      router.push(`/user/${RaUsuario}/new-contribution`);
    } catch (err) {
      console.error("Erro ao logar usuário:", err);
      setError(describeLoginError(err));
    } finally {
      setSubmitting(false);
    }
  };

  // Login Mentor
  // Logs in a mentor and redirects to the mentor-only history view for the team they supervise.
  const handleSubmitMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (isMockMode()) {
        const mentor = loginMockMentor(EmailMentor, SenhaMentor, false);
        setIdMentor(mentor.IdMentor);
        router.push(`/mentor/${mentor.IdMentor}/mentor-history`);
        return;
      }
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await fetch(`${backendUrl}/api/loginMentor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ EmailMentor, SenhaMentor, isAdmin: false }),
      });
      if (!res.ok) {
        setError(await readApiError(res));
        return;
      }
      const { mentor } = await res.json();
      setIdMentor(mentor.IdMentor);
      router.push(`/mentor/${mentor.IdMentor}/mentor-history`);
    } catch (err) {
      console.error("Erro ao logar mentor:", err);
      setError(describeLoginError(err));
    } finally {
      setSubmitting(false);
    }
  };

  // Login Admin
  // Logs in an administrator and routes to the global contribution history dashboard.
  const handleSubmitAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (isMockMode()) {
        const admin = ensureMockAdminForUser(EmailMentor);
        setIdMentor(admin.IdMentor);
        router.push(`/admin/${admin.IdMentor}/admin-history`);
        return;
      }
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await fetch(`${backendUrl}/api/loginAdmin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ EmailMentor, SenhaMentor, isAdmin: true }),
      });
      if (!res.ok) {
        setError(await readApiError(res));
        return;
      }
      const { admin } = await res.json();
      setIdMentor(admin.IdMentor);
      router.push(`/admin/${admin.IdMentor}/admin-history`);
    } catch (err) {
      console.error("Erro ao logar admin:", err);
      setError(describeLoginError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const mentorFields = (
    <MentorInputs
      EmailMentor={EmailMentor}
      setEmailMentor={setEmailMentor}
      SenhaMentor={SenhaMentor}
      setSenhaMentor={setSenhaMentor}
    />
  );

  return (
    <Tabs
      defaultValue="Aluno"
      className="mb-1 h-full w-full max-w-3xl"
      onValueChange={() => setError(null)}
    >
      <TabsList className="flex gap-1">
        <TabsTrigger value="Aluno" className="hover:cursor-pointer">
          Aluno-Mentor
        </TabsTrigger>
        <TabsTrigger value="Mentor" className="hover:cursor-pointer">
          Mentor
        </TabsTrigger>
        <TabsTrigger value="Admin" className="hover:cursor-pointer">
          Admin
        </TabsTrigger>
      </TabsList>

      <TabsContent value="Aluno">
        <LoginCard
          title="Login de Alunos-Mentores"
          onSubmit={handleSubmitAluno}
          submitting={submitting}
          error={error}
        >
          <CustomInputs
            RaUsuario={RaUsuario}
            setRaUsuario={setRaUsuario}
            SenhaUsuario={SenhaUsuario}
            setSenhaUsuario={setSenhaUsuario}
          />
        </LoginCard>
      </TabsContent>

      <TabsContent value="Mentor">
        <LoginCard
          title="Login Mentores"
          onSubmit={handleSubmitMentor}
          submitting={submitting}
          error={error}
        >
          {mentorFields}
        </LoginCard>
      </TabsContent>

      <TabsContent value="Admin">
        <LoginCard
          title="Login Administradores"
          onSubmit={handleSubmitAdmin}
          submitting={submitting}
          error={error}
        >
          {mentorFields}
        </LoginCard>
      </TabsContent>
    </Tabs>
  );
}
