// Registration page for new student-mentors, plus the team setup step that follows it.
"use client";

import React, { useState } from "react";

import AuthShell from "@/components/layout/auth-shell";
import PageShell from "@/components/layout/page-shell";
import SigninTabs from "@/components/tabs-signup";
import TeamTabs from "@/components/tabs-team";

export default function Cadastro() {
  const [isLogged, setIsLogged] = useState(false);
  const [raUsuario, setRaUsuario] = useState(0);

  // Team setup is a wider, multi-field step, so it gets the full page measure
  // rather than the narrow auth panel.
  if (isLogged) {
    return (
      <PageShell ground="background">
        <TeamTabs raUsuario={raUsuario} />
      </PageShell>
    );
  }

  return (
    <AuthShell title="Cadastro de Alunos-mentores">
      <SigninTabs setIsLogged={setIsLogged} setRaUsuario={setRaUsuario} />
    </AuthShell>
  );
}
