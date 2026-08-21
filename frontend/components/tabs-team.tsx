// Tab switcher for team-related views so the page can alternate between grouped datasets.
"use client";

import React from "react";
import BackHome from "@/components/buttons/back";
import { useRouter } from "next/navigation";

interface Props {
  raUsuario: number;
}

export default function TeamTabs({ raUsuario }: Props) {
  const router = useRouter();
  const [NomeTime, setNomeTime] = React.useState("");
  const [RaAluno2, setRaAluno2] = React.useState("");
  const [RaAluno3, setRaAluno3] = React.useState("");
  const [RaAluno4, setRaAluno4] = React.useState("");
  const [RaAluno5, setRaAluno5] = React.useState("");
  const [RaAluno6, setRaAluno6] = React.useState("");
  const [RaAluno7, setRaAluno7] = React.useState("");
  const [RaAluno8, setRaAluno8] = React.useState("");
  const [RaAluno9, setRaAluno9] = React.useState("");
  const [RaAluno10, setRaAluno10] = React.useState("");

  // Creates the team from the onboarding form and redirects the new leader to the first contribution screen.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não está configurada");
      alert("Erro de configuração. Entre em contato com o suporte.");
      return;
    }

    const apiUrl = backendUrl.endsWith("/")
      ? `${backendUrl}api/createTeam`
      : `${backendUrl}/api/createTeam`;

    console.log("Tentando conectar em:", apiUrl);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          NomeTime: NomeTime,
          RaUsuario: Number(raUsuario),
          RaAluno2: Number(RaAluno2) || 0,
          RaAluno3: Number(RaAluno3) || 0,
          RaAluno4: Number(RaAluno4) || 0,
          RaAluno5: Number(RaAluno5) || 0,
          RaAluno6: Number(RaAluno6) || 0,
          RaAluno7: Number(RaAluno7) || 0,
          RaAluno8: Number(RaAluno8) || 0,
          RaAluno9: Number(RaAluno9) || null,
          RaAluno10: Number(RaAluno10) || null,
        }),
      });

      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ error: "Erro desconhecido" }));
        console.error("Erro da API:", err);
        alert("Erro: " + (err.error || `Status ${res.status}`));
        return;
      }

      const newTeam = await res.json();

      router.push(`user/${raUsuario}/new-contribution`);
    } catch (error) {
      console.error("Erro ao cadastrar time:", error);

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        alert(
          "Erro de conexão. Verifique se o backend está rodando e se a URL está correta.",
        );
      } else {
        alert("Erro ao cadastrar time: " + error);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="absolute left-0 top-0">
        <BackHome />
      </div>

      <div className="min-h-screen flex justify-center items-center p-6">
        <div className="flex flex-col md:flex-row w-full max-w-3xl">
          <section className="bg-primary h-120 m-1 flex flex-col rounded-lg items-center justify-center md:w-1/2 p-6 text-white max-w-screen">
            <h1 className="flex text-center font-bold text-[#fff] text-[22px] mb-1">
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

          <section className="border border-gray-300 py-5 rounded-lg m-1 flex flex-col items-start justify-start md:w-[400px] overflow-y-scroll h-[480px] max-w-screen">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="text-base mb-1 mt-1 mr-4 ml-4">
                Nome fantasia do grupo
                <input
                  type="text"
                  name="NomeTime"
                  placeholder="Insira o nome aqui"
                  className="block w-full mr-2 bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-2 text-base focus:outline-none"
                  value={NomeTime}
                  onChange={(e) => setNomeTime(e.target.value)}
                />
              </div>
              <div className="text-base mb-1 mt-1 mr-4 ml-4">
                Ra Aluno 2
                <input
                  type="text"
                  name="RaAluno2"
                  placeholder="Insira o número do RA"
                  className="block w-full mr-2 bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-2 text-base focus:outline-none"
                  value={RaAluno2}
                  onChange={(e) => setRaAluno2(e.target.value)}
                />
              </div>
              <div className="text-base mb-1 mt-1 mr-4 ml-4">
                Ra Aluno 3
                <input
                  type="text"
                  name="RaAluno3"
                  placeholder="Insira o número do RA"
                  className="block w-full mr-2 bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-2 text-base focus:outline-none"
                  value={RaAluno3}
                  onChange={(e) => setRaAluno3(e.target.value)}
                />
              </div>
              <div className="text-base mb-1 mt-1 mr-4 ml-4">
                Ra Aluno 4
                <input
                  type="text"
                  name="RaAluno4"
                  placeholder="Insira o número do RA"
                  className="block w-full  mr-2 bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-2 text-base focus:outline-none"
                  value={RaAluno4}
                  onChange={(e) => setRaAluno4(e.target.value)}
                />
              </div>
              <div className="text-base mb-1 mt-1 mr-4 ml-4">
                Ra Aluno 5
                <input
                  type="text"
                  name="RaAluno5"
                  placeholder="Insira o número do RA"
                  className="block w-full mr-2 bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-2 text-base focus:outline-none"
                  value={RaAluno5}
                  onChange={(e) => setRaAluno5(e.target.value)}
                />
              </div>

              <div className="text-base mb-1 mt-1 mr-4 ml-4">
                Ra Aluno 6
                <input
                  type="text"
                  name="RaAluno6"
                  placeholder="Insira o número do RA"
                  className="block w-full mr-2 bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-2 text-base focus:outline-none"
                  value={RaAluno6}
                  onChange={(e) => setRaAluno6(e.target.value)}
                />
              </div>
              <div className="text-base mb-1 mt-1 mr-4 ml-4">
                Ra Aluno 7
                <input
                  type="text"
                  name="RaAluno7"
                  placeholder="Insira o número do RA"
                  className="block w-full mr-2 bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-2 text-base focus:outline-none"
                  value={RaAluno7}
                  onChange={(e) => setRaAluno7(e.target.value)}
                />
              </div>
              <div className="text-base mb-1 mt-1 mr-4 ml-4">
                Ra Aluno 8
                <input
                  type="text"
                  name="RaAluno8"
                  placeholder="Insira o número do RA"
                  className="block w-full mr-2 bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-2 text-base focus:outline-none"
                  value={RaAluno8}
                  onChange={(e) => setRaAluno8(e.target.value)}
                />
              </div>
              <div className="text-base mb-1 mt-1 mr-4 ml-4">
                Ra Aluno 9
                <input
                  type="text"
                  name="RaAluno9"
                  placeholder="Insira o número do RA"
                  className="block w-full mr-2 bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-2 text-base focus:outline-none"
                  value={RaAluno9}
                  onChange={(e) => setRaAluno9(e.target.value)}
                />
              </div>
              <div className="text-base mb-1 mt-1 mr-4 ml-4">
                Ra Aluno 10
                <input
                  type="text"
                  name="RaAluno10"
                  placeholder="Insira o número do RA"
                  className="block w-full mr-2 bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-2 text-base focus:outline-none"
                  value={RaAluno10}
                  onChange={(e) => setRaAluno10(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="border-transparent text-white hover:text-white! hover:bg-secondary/80 py-2 px-6 m-4 bg-secondary self-end rounded-lg"
              >
                Cadastrar
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
