// Login page. Composes the authentication form with the shared auth shell.
"use client";

import React from "react";
import Link from "next/link";

import AuthShell from "@/components/layout/auth-shell";
import TabsLogin from "@/components/tabs-login";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <AuthShell
      aside={
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-primary-foreground/80">
            É aluno e ainda não tem cadastro?
          </p>
          <Button asChild variant="soft" size="sm">
            <Link href="/register/sign-up">Cadastre-se</Link>
          </Button>
          <p className="max-w-[16rem] text-balance text-sm text-primary-foreground/80">
            Registre-se com seus dados institucionais para utilizar os recursos
            do site.
          </p>
        </div>
      }
    >
      <TabsLogin />
    </AuthShell>
  );
}
