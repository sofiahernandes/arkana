// Tab switcher for team-related views so the page can alternate between grouped datasets.
"use client";

import React from "react";
import BackHome from "@/components/buttons/back";
import { useRouter } from "next/navigation";

import Field from "@/components/forms/field";
import { Button } from "@/components/ui/button";

interface Props {
  raUsuario: number;
}

/** Members 2–8 are required by the backend (it wants 0, not null); 9 and 10 are optional. */
const MEMBROS = [2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const OPCIONAIS = new Set([9, 10]);

export default function TeamTabs({ raUsuario }: Props) {
  const router = useRouter();
  const [NomeTime, setNomeTime] = React.useState("");
  // Nine sibling useState calls collapsed into the shape the payload needs.
  const [ras, setRas] = React.useState<Record<number, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const setRa = (numero: number, valor: string) =>
    setRas((atual) => ({ ...atual, [numero]: valor }));

  // Creates the team from the onboarding form and redirects the new leader to the first contribution screen.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      setError(
        "O endereço do servidor não está configurado (NEXT_PUBLIC_BACKEND_URL). Avise a coordenação do projeto antes de tentar de novo.",
      );
      return;
    }

    const apiUrl = backendUrl.endsWith("/")
      ? `${backendUrl}api/createTeam`
      : `${backendUrl}/api/createTeam`;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          NomeTime: NomeTime,
          RaUsuario: Number(raUsuario),
          ...Object.fromEntries(
            MEMBROS.map((numero) => [
              `RaAluno${numero}`,
              Number(ras[numero]) || (OPCIONAIS.has(numero) ? null : 0),
            ]),
          ),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        console.error("Erro da API:", body);
        setError(
          body?.error ??
            body?.message ??
            `O servidor recusou o cadastro do time (status ${res.status}). Confira o nome e os R.A. informados.`,
        );
        return;
      }

      router.push(`user/${raUsuario}/new-contribution`);
    } catch (err) {
      console.error("Erro ao cadastrar time:", err);
      setError(
        err instanceof TypeError && err.message === "Failed to fetch"
          ? "Não foi possível falar com o servidor. Verifique sua conexão e tente novamente — o time não foi criado."
          : "Não foi possível cadastrar o time. Tente novamente em instantes.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="absolute left-0 top-0">
        <BackHome />
      </div>

      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex w-full max-w-3xl flex-col md:flex-row">
          <section className="m-1 flex h-120 max-w-screen flex-col items-center justify-center rounded-lg bg-primary p-6 text-primary-foreground md:w-1/2">
            <h1 className="mb-1 flex text-center text-2xl font-bold">
              Cadastro de
              <br />
              time
            </h1>
            <img
              src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=180,fit=crop,q=95/dOq4lP0kVLiEl8Z3/lideranaas-empaticas-logo-AoPWG9oBrrt3QGv0.png"
              alt="logo lideranças empáticas"
              className="mb-6 w-28 md:w-36"
            />
          </section>

          <section className="m-1 flex h-120 max-w-screen flex-col items-start justify-start overflow-y-auto rounded-lg border border-border bg-card py-5 md:w-100">
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 px-4">
              <Field
                label="Nome fantasia do grupo"
                name="NomeTime"
                type="text"
                placeholder="Insira o nome aqui"
                value={NomeTime}
                onChange={(e) => setNomeTime(e.target.value)}
                required
              />

              {MEMBROS.map((numero) => (
                <Field
                  key={numero}
                  label={`Ra Aluno ${numero}`}
                  name={`RaAluno${numero}`}
                  type="text"
                  inputMode="numeric"
                  placeholder="Insira o número do RA"
                  hint={OPCIONAIS.has(numero) ? "Opcional" : undefined}
                  value={ras[numero] ?? ""}
                  onChange={(e) => setRa(numero, e.target.value)}
                />
              ))}

              {error && (
                <p role="alert" className="text-sm font-medium text-destructive">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="secondary"
                loading={submitting}
                className="mt-1 self-end"
              >
                {submitting ? "Cadastrando…" : "Cadastrar"}
              </Button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
