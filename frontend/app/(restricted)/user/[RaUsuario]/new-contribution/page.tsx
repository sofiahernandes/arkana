// Restricted contribution creation page. Coordinates form state, API submission, and receipt upload flow.
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import PageHeader from "@/components/layout/page-header";
import PageShell from "@/components/layout/page-shell";
import DonationsForm from "@/components/donations-forms";
import FoodDonations from "@/components/food-donations";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  createMockContribution,
  getMockTeamByUser,
  getMockUser,
  isMockMode,
} from "@/lib/mock-db";

export default function Donations() {
  const params = useParams();
  const [RaUsuario, setRaUsuario] = useState<number>(2001);
  const [team, setTeam] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"finance" | "food">("finance");

  const [financialData, setFinancialData] = useState({
    fonte: "",
    meta: 0,
    gastos: 0,
    quantidade: 0,
    comprovante: null as File | null,
  });

  const [foodData, setFoodData] = useState({
    fonte: "",
    meta: 0,
    gastos: 0,
    quantidade: 0,
    pesoUnidade: 0,
    comprovante: null as File | null,
    idAlimento: 1,
  });

  const [totaisPontos, setTotaisPontos] = useState(0);

  // Reads the user route once and hydrates the initial participant/team context, including mock mode support.
  useEffect(() => {
    if (params?.RaUsuario) {
      const ra = Number(params.RaUsuario);
      setRaUsuario(ra);
      if (isMockMode()) {
        setTeam(getMockTeamByUser(ra));
        setUser(getMockUser(ra));
      }
    }
  }, [params]);

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
  const apiUrl = `${backend_url}/api/createContribution`;

  // Sends a financial contribution first, then uploads the receipt only if the contribution was created successfully.
  const handleFinancialSubmit = async () => {
    if (loading || !RaUsuario) return;

    if (
      !financialData.fonte.trim() ||
      !financialData.quantidade ||
      financialData.quantidade <= 0
    ) {
      toast.error(
        "Informe a fonte e uma quantidade maior que zero para cadastrar a contribuição financeira.",
      );
      return;
    }

    setLoading(true);

    try {
      if (isMockMode()) {
        createMockContribution({
          RaUsuario,
          TipoDoacao: "Financeira",
          Quantidade: Number(financialData.quantidade),
          Meta: Number(financialData.meta) || 0,
          Gastos: Number(financialData.gastos) || 0,
          Fonte: financialData.fonte.trim(),
        });
        toast.success("Contribuição financeira cadastrada com sucesso!");
        setFinancialData({
          fonte: "",
          meta: 0,
          gastos: 0,
          quantidade: 0,
          comprovante: null,
        });
        return;
      }
      const body = {
        RaUsuario: RaUsuario,
        TipoDoacao: "Financeira",
        Quantidade: Number(financialData.quantidade),
        Meta: Number(financialData.meta) || 0,
        Gastos: Number(financialData.gastos) || 0,
        Fonte: financialData.fonte.trim(),
      };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Erro ${res.status}`);
      }

      const data = await res.json();
      const IdContribuicaoFinanceira = data.data?.IdContribuicaoFinanceira;

      if (financialData.comprovante && IdContribuicaoFinanceira) {
        const formData = new FormData();
        formData.append("file", financialData.comprovante);

        const resComprovante = await fetch(
          `${backend_url}/api/comprovante/financeira/${IdContribuicaoFinanceira}`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!resComprovante.ok) {
          const errorData = await resComprovante.json();
          console.warn("Erro ao enviar comprovante:", errorData);
          // The contribution saved but its proof did not. Saying "sucesso"
          // here would hide a loss the participant needs to act on.
          toast.warning(
            "Contribuição cadastrada, mas o comprovante não foi enviado. Anexe o comprovante novamente pelo histórico.",
          );
          setFinancialData({
            fonte: "",
            meta: 0,
            gastos: 0,
            quantidade: 0,
            comprovante: null,
          });
          return;
        }
      }

      toast.success("Contribuição financeira cadastrada com sucesso!");

      setFinancialData({
        fonte: "",
        meta: 0,
        gastos: 0,
        quantidade: 0,
        comprovante: null,
      });
    } catch (err: any) {
      console.error(err);
      toast.error(
        `Não foi possível cadastrar a contribuição financeira. ${err.message ?? "Tente novamente em instantes."}`,
      );
    } finally {
      setLoading(false);
    }
  };

  // Reuses the same contribution endpoint for food donations and follows with the optional receipt upload step.
  const handleFoodSubmit = async () => {
    if (loading || !RaUsuario) return;

    if (!foodData.idAlimento || foodData.idAlimento <= 0) {
      toast.error("Selecione um alimento na lista para continuar.");
      return;
    }

    if (
      !foodData.fonte.trim() ||
      !foodData.quantidade ||
      foodData.quantidade <= 0 ||
      !foodData.pesoUnidade ||
      foodData.pesoUnidade <= 0
    ) {
      toast.error(
        "Informe a fonte, a quantidade e o peso por unidade para cadastrar a contribuição alimentícia.",
      );
      return;
    }

    setLoading(true);

    try {
      if (isMockMode()) {
        createMockContribution({
          RaUsuario: Number(RaUsuario),
          TipoDoacao: "Alimenticia",
          Quantidade: Number(foodData.quantidade),
          PesoUnidade: Number(foodData.pesoUnidade),
          Gastos: Number(foodData.gastos) || 0,
          Meta: Number(foodData.meta) || 0,
          Fonte: foodData.fonte.trim(),
          NomeAlimento: "Alimento",
          alimentos: [{ NomeAlimento: "Alimento", Pontuacao: 4 }],
        });
        toast.success("Contribuição alimentícia cadastrada com sucesso!");
        setFoodData({
          fonte: "",
          meta: 0,
          gastos: 0,
          idAlimento: 0,
          quantidade: 0,
          pesoUnidade: 0,
          comprovante: null,
        });
        setTotaisPontos(0);
        return;
      }
      const body = {
        RaUsuario: Number(RaUsuario),
        TipoDoacao: "Alimenticia",
        Quantidade: Number(foodData.quantidade),
        PesoUnidade: Number(foodData.pesoUnidade),
        Gastos: Number(foodData.gastos) || 0,
        Meta: Number(foodData.meta) || 0,
        Fonte: foodData.fonte.trim(),
        IdAlimento: Number(foodData.idAlimento),
      };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Erro ${res.status}`);
      }

      const comprovante = await res.json();
      const IdContribuicaoAlimenticia =
        comprovante.data?.IdContribuicaoAlimenticia;

      if (foodData.comprovante && IdContribuicaoAlimenticia) {
        const formData = new FormData();
        formData.append("file", foodData.comprovante);

        const url = `${backend_url}/api/comprovante/alimenticia/${IdContribuicaoAlimenticia}`;

        const resComprovante = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (!resComprovante.ok) {
          const errorData = await resComprovante.json();
          console.error("Erro ao enviar comprovante:", errorData);
          toast.warning(
            "Contribuição cadastrada, mas o comprovante não foi enviado. Anexe o comprovante novamente pelo histórico.",
          );
          setFoodData({
            fonte: "",
            meta: 0,
            gastos: 0,
            idAlimento: 0,
            quantidade: 0,
            pesoUnidade: 0,
            comprovante: null,
          });
          setTotaisPontos(0);
          return;
        }
      }

      toast.success("Contribuição alimentícia cadastrada com sucesso!");

      setFoodData({
        fonte: "",
        meta: 0,
        gastos: 0,
        idAlimento: 0,
        quantidade: 0,
        pesoUnidade: 0,
        comprovante: null,
      });
      setTotaisPontos(0);
    } catch (err: any) {
      console.error(err);
      toast.error(
        `Não foi possível cadastrar a contribuição alimentícia. ${err.message ?? "Tente novamente em instantes."}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell nav={{ role: "user", id: String(RaUsuario) }}>
      <PageHeader
        title={
          team?.NomeTime
            ? `Nova contribuição — ${team.NomeTime}`
            : "Nova contribuição"
        }
        description="Cadastre uma arrecadação financeira ou de alimentos e anexe o comprovante."
      />

      {/* Both forms sit side by side from lg up; below that they share one
          column and this control picks which is showing. */}
      <div
        role="group"
        aria-label="Tipo de contribuição"
        className="sticky top-4 z-10 mb-6 grid grid-cols-2 gap-1 rounded-md border border-input bg-muted p-1 lg:hidden"
      >
        {(
          [
            ["finance", "Financeira"],
            ["food", "Alimentos"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveTab(value)}
            aria-pressed={activeTab === value}
            className={cn(
              "h-10 rounded-sm text-sm font-medium",
              "transition-colors duration-[--duration-base] ease-[--ease-out]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              activeTab === value
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section
          className={cn(
            activeTab === "finance" ? "flex" : "hidden",
            "flex-col rounded-lg border border-border bg-card p-6 shadow-sm lg:flex",
          )}
        >
          <h2 className="mb-6 text-lg font-semibold text-primary">
            Contribuição financeira
          </h2>

          <DonationsForm
                fonte={financialData.fonte}
                setFonte={(v) =>
                  setFinancialData({ ...financialData, fonte: v })
                }
                meta={financialData.meta}
                setMeta={(v) =>
                  setFinancialData({ ...financialData, meta: Number(v) })
                }
                gastos={financialData.gastos}
                setGastos={(v) =>
                  setFinancialData({ ...financialData, gastos: Number(v) })
                }
                quantidade={financialData.quantidade}
                setQuantidade={(v) =>
                  setFinancialData({ ...financialData, quantidade: Number(v) })
                }
                comprovante={financialData.comprovante}
                setComprovante={(v) =>
                  setFinancialData({ ...financialData, comprovante: v })
                }
                tipoDoacao={"Financeira"}
                setTipoDoacao={() => {}}
                RaUsuario={RaUsuario ?? 0}
                setRaUsuario={setRaUsuario}
              />

          <div className="mt-8 flex justify-end">
            <Button
              type="button"
              onClick={handleFinancialSubmit}
              loading={loading}
            >
              Cadastrar
            </Button>
          </div>
        </section>

        <section
          className={cn(
            activeTab === "food" ? "flex" : "hidden",
            "flex-col rounded-lg border border-border bg-card p-6 shadow-sm lg:flex",
          )}
        >
          <h2 className="mb-6 text-lg font-semibold text-primary">
            Contribuição alimentícia
          </h2>

          <div className="min-h-0 flex-1">
            <FoodDonations
                  fonte={foodData.fonte}
                  setFonte={(v) => setFoodData({ ...foodData, fonte: v })}
                  meta={foodData.meta}
                  setMeta={(v) => setFoodData({ ...foodData, meta: Number(v) })}
                  gastos={foodData.gastos}
                  setGastos={(v) =>
                    setFoodData({ ...foodData, gastos: Number(v) })
                  }
                  quantidade={foodData.quantidade}
                  setQuantidade={(v) =>
                    setFoodData({ ...foodData, quantidade: Number(v) })
                  }
                  pesoUnidade={foodData.pesoUnidade}
                  setPesoUnidade={(v) =>
                    setFoodData({ ...foodData, pesoUnidade: Number(v) })
                  }
                  idAlimento={foodData.idAlimento}
                  setIdAlimento={(v) =>
                    setFoodData({ ...foodData, idAlimento: Number(v) })
                  }
                  comprovante={foodData.comprovante}
                  setComprovante={(v) =>
                    setFoodData({ ...foodData, comprovante: v })
                  }
                  onTotaisChange={(totais) => setTotaisPontos(totais.pontos)}
                />
              </div>

          <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
            <p className="rounded-md bg-terciary px-3 py-2 text-sm text-terciary-foreground">
              Pontuação{" "}
              <span className="font-semibold tabular-nums">
                {totaisPontos.toLocaleString("pt-BR")}
              </span>
            </p>

            <Button type="button" onClick={handleFoodSubmit} loading={loading}>
              Cadastrar
            </Button>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
