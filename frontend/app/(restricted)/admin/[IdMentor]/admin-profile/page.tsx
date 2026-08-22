// Restricted administrator profile page. Centralizes admin-level account and dashboard information.
"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import Arkana from "@/assets/Arkana.png";
import Field from "@/components/forms/field";
import PageHeader from "@/components/layout/page-header";
import PageShell from "@/components/layout/page-shell";
import { InfoList, InfoRow } from "@/components/layout/info-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMockMentor, isMockMode } from "@/lib/mock-db";

export default function AdminProfile() {
  const params = useParams();
  const adminId = parseInt(params.IdMentor as string, 10);

  const [adminLogado, setAdminLogado] = React.useState<string>();
  const [newEmailMentor, setNewEmailMentor] = React.useState("");
  const [senhaMentor, setSenhaMentor] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Loads the currently logged administrator email so the profile card reflects the active account.
  useEffect(() => {
    // Fetches the admin record through the mentor endpoint because administrators share that backend model.
    const fetchAdminData = async () => {
      try {
        if (isMockMode()) {
          const data = getMockMentor(adminId);
          setAdminLogado(data?.EmailMentor);
          return;
        }
        const response = await fetch(`${BACKEND_URL}/api/mentor/${adminId}`);
        if (!response.ok) throw new Error("Erro ao buscar dados do mentor");
        const data = await response.json();
        setAdminLogado(data.EmailMentor);
      } catch (err) {
        console.error(err);
      }
    };
    if (adminId !== null) {
      fetchAdminData();
    }
  }, [adminId]);

  // Creates a second administrator account from this screen without leaving the current admin session.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmailMentor.trim()) {
      toast.error("Informe o email do novo administrador.");
      return;
    }
    if (senhaMentor.length < 8) {
      toast.error("A senha precisa ter ao menos 8 caracteres.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isMockMode()) {
        toast.success("Administrador cadastrado no ambiente de demonstração.");
        return;
      }
      const response = await fetch(`${BACKEND_URL}/api/createAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          EmailMentor: newEmailMentor,
          SenhaMentor: senhaMentor,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar novo admin no banco de dados.");
      }
      await response.json();
      toast.success("Administrador cadastrado com sucesso.");

      setNewEmailMentor("");
      setSenhaMentor("");
    } catch (error) {
      // The raw error was surfaced to the user before; keep it in the console.
      console.error(error);
      toast.error(
        "Não foi possível cadastrar o administrador. Verifique se o email já está em uso.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell nav={{ role: "admin", id: String(adminId) }}>
      <PageHeader
        title="Perfil do administrador"
        description="Sua conta e o cadastro de novos administradores do Arkana."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conta ativa</CardTitle>
            </CardHeader>
            <CardContent>
              <InfoList>
                <InfoRow label="Email" empty="Carregando…">
                  {adminLogado}
                </InfoRow>
              </InfoList>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cadastrar novo administrador</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 max-w-prose text-sm text-muted-foreground">
                O novo administrador terá os mesmos acessos que você, incluindo o
                histórico de contribuições de todos os grupos.
              </p>

              <form onSubmit={handleSubmit} className="max-w-md space-y-4">
                <Field
                  label="Email"
                  name="EmailMentor"
                  type="email"
                  autoComplete="off"
                  placeholder="novo.administrador@exemplo.com"
                  value={newEmailMentor}
                  onChange={(e) => setNewEmailMentor(e.target.value)}
                  required
                />
                <Field
                  label="Senha"
                  name="SenhaMentor"
                  type="password"
                  autoComplete="new-password"
                  hint="Ao menos 8 caracteres."
                  minLength={8}
                  value={senhaMentor}
                  onChange={(e) => setSenhaMentor(e.target.value)}
                  required
                />
                <Button type="submit" loading={isSubmitting}>
                  Cadastrar administrador
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <aside className="flex flex-col items-center justify-center gap-6 rounded-lg bg-primary p-8 text-center shadow-sm">
          <p className="font-display text-3xl leading-tight text-primary-foreground">
            Arkana
            <br />+ Lideranças Empáticas
          </p>
          <Image
            src={Arkana}
            alt=""
            width={240}
            height={240}
            className="h-auto w-full max-w-[15rem] object-contain"
          />
        </aside>
      </div>
    </PageShell>
  );
}
