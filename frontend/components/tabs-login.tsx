// Tab wrapper used by the login screen to keep authentication variants in one place.
"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomInputs from "./login-user-inputs";
import MentorInputs from "./administrator/login-forms";
import { useRouter } from "next/navigation";
import {
  ensureMockAdminForUser,
  isMockMode,
  loginMockMentor,
  loginMockUser,
} from "@/lib/mock-db";

export default function TabsLogin() {
  const router = useRouter();
  const [_, setIdMentor] = React.useState<number>();
  const [EmailMentor, setEmailMentor] = React.useState("");
  const [SenhaMentor, setSenhaMentor] = React.useState("");
  const [RaUsuario, setRaUsuario] = React.useState("2024001");
  const [SenhaUsuario, setSenhaUsuario] = React.useState("123@Arkana");

  // Login Student
  // Logs in a participant and routes them straight to the contribution creation area for their own profile.
  const handleSubmitAluno = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isMockMode()) {
        loginMockUser(parseInt(RaUsuario), SenhaUsuario);
        router.push(`/user/${RaUsuario}/new-contribution`);
        return;
      }
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const apiUrl = `${backendUrl}/api/user/login`;
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          RaUsuario: parseInt(RaUsuario),
          SenhaUsuario,
        }),
      });
      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ error: "Erro desconhecido" }));
        alert("Erro: " + (err.error || `Status ${res.status}`));
        return;
      }
      router.push(`/user/${RaUsuario}/new-contribution`);
    } catch {
      alert("Erro ao logar usuário");
    }
  };

  // Login Mentor
  // Logs in a mentor and redirects to the mentor-only history view for the team they supervise.
  const handleSubmitMentor = async (e: React.FormEvent) => {
    e.preventDefault();

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
        const err = await res
          .json()
          .catch(() => ({ error: "Erro desconhecido" }));
        console.error("Erro da API:", err);
        alert("Erro: " + (err.error || `Status ${res.status}`));
        return;
      }
      const { mentor } = await res.json();
      setIdMentor(mentor.IdMentor);
      router.push(`/mentor/${mentor.IdMentor}/mentor-history`);
    } catch (error) {
      console.error("Erro ao logar mentor:", error);
    }
  };

  // Login Admin
  // Logs in an administrator and routes to the global contribution history dashboard.
  const handleSubmitAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

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
        const err = await res
          .json()
          .catch(() => ({ error: "Erro desconhecido" }));
        console.error("Erro da API:", err);
        alert("Erro: " + (err.error || `Status ${res.status}`));
        return;
      }
      const { admin } = await res.json();
      setIdMentor(admin.IdMentor);
      router.push(`/admin/${admin.IdMentor}/admin-history`);
    } catch (error) {
      console.error("Erro ao logar admin:", error);
    }
  };

  return (
    <Tabs defaultValue="Aluno" className="md:w-[700px] h-full mb-1">
      <TabsList className="flex gap-1">
        <TabsTrigger value="Aluno" className="hover:cursor-pointer">
          Aluno-Mentor
        </TabsTrigger>
        <TabsTrigger value="Mentor" className="hover:cursor-pointer">
          Mentor
        </TabsTrigger>
        <TabsTrigger value="Admin"> Admin</TabsTrigger>
      </TabsList>

      <TabsContent value="Aluno">
        <section className="border border-gray-300 h-full rounded-lg mb-2 flex flex-col items-center justify-center md:w-[365px] px-6 py-8">
          <h2 className="text-secondary text-center font-bold text-xl md:text-xl my-4">
            Login de Alunos-Mentores
          </h2>
          <form
            onSubmit={handleSubmitAluno}
            className="flex flex-col gap-4 w-full"
          >
            <CustomInputs
              RaUsuario={RaUsuario!}
              setRaUsuario={setRaUsuario}
              SenhaUsuario={SenhaUsuario}
              setSenhaUsuario={setSenhaUsuario}
            />
            <button
              type="submit"
              className="border-transparent bg-secondary hover:text-white! text-white text-base py-2 px-6 w-[90px] md:w-28 self-center hover:bg-secondary/80 rounded-lg"
            >
              Entrar
            </button>
          </form>
        </section>
      </TabsContent>

      <TabsContent value="Mentor">
        <section className="border border-gray-300 h-full rounded-lg mb-2 flex flex-col items-center justify-center md:w-[365px] px-6 py-8">
          <h2 className="text-secondary text-center font-bold text-xl md:text-xl my-4">
            Login Mentores
          </h2>
          <form
            onSubmit={handleSubmitMentor}
            className="flex flex-col gap-4 w-full"
          >
            <MentorInputs
              EmailMentor={EmailMentor}
              setEmailMentor={setEmailMentor}
              SenhaMentor={SenhaMentor}
              setSenhaMentor={setSenhaMentor}
            />
            <button
              type="submit"
              className="border-transparent bg-secondary hover:text-white! text-white text-base py-2 px-6 w-[90px] md:w-28 self-center hover:bg-secondary/80 rounded-lg"
            >
              Entrar
            </button>
          </form>
        </section>
      </TabsContent>
      <TabsContent value="Admin">
        <section className="border border-gray-300 h-full rounded-lg mb-2 flex flex-col items-center justify-center md:w-[365px] px-6 py-8">
          <h2 className="text-secondary text-center font-bold text-xl md:text-xl my-4">
            Login Administradores
          </h2>
          <form
            onSubmit={handleSubmitAdmin}
            className="flex flex-col gap-4 w-full"
          >
            <MentorInputs
              EmailMentor={EmailMentor}
              setEmailMentor={setEmailMentor}
              SenhaMentor={SenhaMentor}
              setSenhaMentor={setSenhaMentor}
            />
            <button
              type="submit"
              className="border-transparent bg-secondary hover:text-white! text-white text-base py-2 px-6 w-[90px] md:w-28 self-center hover:bg-secondary/80 rounded-lg"
            >
              Entrar
            </button>
          </form>
        </section>
      </TabsContent>
    </Tabs>
  );
}
