// Restricted contribution creation page. Coordinates form state, API submission, and receipt upload flow.
"use client";

import { SetStateAction, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "@/styles/globals.css";
import MenuDesktop from "@/components/menu";
import MenuMobile from "@/components/menu-mobile";
import DonationsForm from "@/components/donations-forms";
import FoodDonations from "@/components/food-donations";
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
  const [menuOpen, setMenuOpen] = useState(false);
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
      alert(
        "Preencha todos os campos obrigatórios da contribuição financeira.",
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
        alert("Contribuição financeira cadastrada com sucesso!");
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
        }
      }

      alert("Contribuição financeira cadastrada com sucesso!");

      setFinancialData({
        fonte: "",
        meta: 0,
        gastos: 0,
        quantidade: 0,
        comprovante: null,
      });
    } catch (err: any) {
      alert(`Erro ao cadastrar contribuição financeira: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Reuses the same contribution endpoint for food donations and follows with the optional receipt upload step.
  const handleFoodSubmit = async () => {
    if (loading || !RaUsuario) return;

    if (!foodData.idAlimento || foodData.idAlimento <= 0) {
      alert("Selecione um alimento válido.");
      return;
    }

    if (
      !foodData.fonte.trim() ||
      !foodData.quantidade ||
      foodData.quantidade <= 0 ||
      !foodData.pesoUnidade ||
      foodData.pesoUnidade <= 0
    ) {
      alert(
        "Preencha todos os campos obrigatórios da contribuição alimentícia.",
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
        alert("Contribuição alimentícia cadastrada com sucesso!");
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
        } else {
          console.log("Comprovante enviado com sucesso!");
        }
      }

      alert("Contribuição alimentícia cadastrada com sucesso!");

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
      alert(`Erro ao cadastrar contribuição alimentícia: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container w-full pt-6 md:pt-16 pb-26 md:pb-16 space-y-6">
      <header className="w-full">
        <button
          className={`open-menu ${menuOpen ? "hidden" : "menu-icon"}`}
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>

        <div className="sticky top-0 left-0 right-0 z-10">
          <div className="lg:hidden w-full flex justify-center">
            <div className="inline-grid grid-cols-2 w-full rounded-full border border-gray bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab("finance")}
                className={`rounded-full p-3 text-sm font-medium ${
                  activeTab === "finance"
                    ? "bg-primary text-white"
                    : "text-black"
                }`}
              >
                Financeira
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("food")}
                className={`rounded-full p-3 text-sm font-medium ${
                  activeTab === "food" ? "bg-primary text-white" : "text-black"
                }`}
              >
                Alimentos
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="page-container">
        <MenuDesktop menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <MenuMobile />

        <main className="flex flex-col justify-center items-stretch w-full px-4">
          <div className="flex flex-col gap-2 text-center mb-8">
            <h3 className="text-2xl uppercase font-semibold text-primary">
              Nova contribuição ao time {team?.NomeTime && team?.NomeTime}
            </h3>
          </div>
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-x-4">
            <div
              className={`${
                activeTab === "finance" ? "block" : "hidden"
              } lg:block bg-white border border-gray-200 p-6 rounded-xl shadow-md w-full min-h-[600px]`}
            >
              <h2 className="text-2xl font-semibold mb-4">Financeiras</h2>

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

              <div className="mt-13 flex justify-end">
                <button
                  type="button"
                  onClick={handleFinancialSubmit}
                  disabled={loading}
                  className="w-fit px-4 py-2 rounded-[8px] bg-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Cadastrar"}
                </button>
              </div>
            </div>

            <div
              className={`${
                activeTab === "food" ? "block" : "hidden"
              } lg:flex lg:flex-col bg-white border border-gray-200 p-6 rounded-xl shadow-md w-full min-h-[600px]`}
            >
              <h2 className="text-2xl font-semibold mb-3">Alimentícias</h2>

              <div className="min-h-0 flex-1 overflow-y-auto rounded-lg">
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

              <div className="mt-4 flex flex-none items-center gap-3 justify-end">
                <div className="bg-secondary/50 text-sm rounded-lg py-2 px-2 md:px-16 wrap-anywhere w-[300px] text-ellipsis">
                  Pontuação: <span>{totaisPontos.toLocaleString("pt-BR")}</span>
                </div>

                <button
                  type="button"
                  onClick={handleFoodSubmit}
                  disabled={loading}
                  className="w-fit px-4 py-2 rounded-lg bg-primary text-white hover:bg-[#195b41] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Cadastrar"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
