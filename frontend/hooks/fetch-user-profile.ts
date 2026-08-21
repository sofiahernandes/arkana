// Data-fetching hook dedicated to loading the logged-in user profile payload.
interface Team {
  NomeTime: string;
  RaUsuario: number;
  RaAluno2: number;
  RaAluno3: number;
  RaAluno4: number;
  RaAluno5: number;
  RaAluno6: number;
  RaAluno7: number;
  RaAluno8: number;
  RaAluno9: number;
  RaAluno10: number;
  IdMentor: number;
}

interface User {
  RaUsuario: number;
  NomeUsuario: string;
  TurmaUsuario: string;
}

import { getMockTeamByUser, getMockUser, isMockMode } from "@/lib/mock-db";

export async function fetchData(
  RaUsuario: number,
): Promise<{ team: Team; user: User } | undefined> {
  try {
    if (isMockMode()) {
      const team = getMockTeamByUser(RaUsuario);
      const user = getMockUser(RaUsuario);
      if (!team || !user) return;
      return { team, user };
    }
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await fetch(`${backend_url}/api/${RaUsuario}/userTeam`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const userRes = await fetch(`${backend_url}/api/user/${RaUsuario}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errText = await res.text();
      alert("Erro ao buscar time: " + errText);
      return;
    }

    if (!userRes.ok) {
      const errText = await userRes.text();
      alert("Erro ao buscar usuario" + errText);
      return;
    }
    const team = await res.json();
    const user = await userRes.json();

    return { team, user };
  } catch (error) {
    console.error(error);
    alert("Erro ao buscar time.");
  }
}
