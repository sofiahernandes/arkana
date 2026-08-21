// Mock data helpers used when the frontend runs without the real backend or seeded database.
export type MockUser = {
  RaUsuario: number;
  NomeUsuario: string;
  EmailUsuario: string;
  SenhaUsuario: string;
  TelefoneUsuario: string;
  TurmaUsuario: string;
};

export type MockMentor = {
  IdMentor: number;
  NomeMentor: string;
  EmailMentor: string;
  SenhaMentor: string;
  IsAdmin?: boolean;
};

export type MockTeam = {
  NomeTime: string;
  RaUsuario: number;
  RaAlunos: number[];
  IdMentor: number;
};

export type MockContribution = {
  RaUsuario: number;
  TipoDoacao: "Financeira" | "Alimenticia";
  Quantidade: number;
  Meta?: number;
  Gastos?: number;
  Fonte: string;
  DataContribuicao: string;
  NomeAlimento?: string;
  PesoUnidade?: number;
  NomeTime?: string;
  IdContribuicao: number;
  comprovante?: { IdComprovante: number; Imagem: string };
  alimentos?: { NomeAlimento: string; Pontuacao?: number }[];
};

type MockState = {
  users: MockUser[];
  mentors: MockMentor[];
  teams: MockTeam[];
  contributions: MockContribution[];
};

const STORAGE_KEY = "arkana-mock-db";

const seededState: MockState = {
  users: [
    {
      RaUsuario: 2024001,
      NomeUsuario: "Maria da Silva",
      EmailUsuario: "maria@arkana.com",
      SenhaUsuario: "123@Arkana",
      TelefoneUsuario: "(11) 99999-0001",
      TurmaUsuario: "1MA",
    },
    {
      RaUsuario: 2024002,
      NomeUsuario: "Carlos Henrique Souza",
      EmailUsuario: "carlos@arkana.com",
      SenhaUsuario: "123@Arkana",
      TelefoneUsuario: "(11) 99999-0002",
      TurmaUsuario: "1MB",
    },
  ],
  mentors: [
    {
      IdMentor: 101,
      NomeMentor: "Marina Alves",
      EmailMentor: "mentora@arkana.com",
      SenhaMentor: "123@Arkana",
    },
    {
      IdMentor: 201,
      NomeMentor: "Paulo Rocha",
      EmailMentor: "admin@arkana.com",
      SenhaMentor: "123@Arkana",
      IsAdmin: true,
    },
  ],
  teams: [
    {
      NomeTime: "Aurora",
      RaUsuario: 2024001,
      RaAlunos: [2024001, 2024003, 2024004, 2024005, 2024006],
      IdMentor: 101,
    },
    {
      NomeTime: "Horizonte",
      RaUsuario: 2024002,
      RaAlunos: [2024002, 2024007, 2024008, 2024009, 2024010],
      IdMentor: 101,
    },
  ],
  contributions: [
    {
      IdContribuicao: 1,
      RaUsuario: 2024001,
      TipoDoacao: "Financeira",
      Quantidade: 1500,
      Meta: 2000,
      Gastos: 200,
      Fonte: "Campanha de voluntariado",
      DataContribuicao: "2026-06-01",
      NomeTime: "Aurora",
    },
    {
      IdContribuicao: 2,
      RaUsuario: 2024001,
      TipoDoacao: "Alimenticia",
      Quantidade: 48,
      PesoUnidade: 0.5,
      Gastos: 0,
      Fonte: "Arrecadação de alimentos",
      DataContribuicao: "2026-06-04",
      NomeAlimento: "Arroz",
      NomeTime: "Aurora",
      alimentos: [{ NomeAlimento: "Arroz", Pontuacao: 4 }],
    },
    {
      IdContribuicao: 3,
      RaUsuario: 2024002,
      TipoDoacao: "Financeira",
      Quantidade: 870,
      Meta: 1000,
      Gastos: 120,
      Fonte: "Evento solidário",
      DataContribuicao: "2026-06-05",
      NomeTime: "Horizonte",
    },
    {
      IdContribuicao: 4,
      RaUsuario: 2024001,
      TipoDoacao: "Financeira",
      Quantidade: 500,
      Meta: 500,
      Gastos: 50,
      Fonte: "Bazar beneficente",
      DataContribuicao: "2026-06-06",
      NomeTime: "Aurora",
    },
    {
      IdContribuicao: 5,
      RaUsuario: 2024001,
      TipoDoacao: "Financeira",
      Quantidade: 200,
      Meta: 1000,
      Gastos: 0,
      Fonte: "Doação direta via PIX",
      DataContribuicao: "2026-06-07",
      NomeTime: "Aurora",
    },
    {
      IdContribuicao: 6,
      RaUsuario: 2024002,
      TipoDoacao: "Financeira",
      Quantidade: 1200,
      Meta: 2000,
      Gastos: 100,
      Fonte: "Rifa solidária",
      DataContribuicao: "2026-06-08",
      NomeTime: "Horizonte",
    },
    {
      IdContribuicao: 7,
      RaUsuario: 2024001,
      TipoDoacao: "Financeira",
      Quantidade: 3000,
      Meta: 5000,
      Gastos: 300,
      Fonte: "Patrocínio comércio local",
      DataContribuicao: "2026-06-09",
      NomeTime: "Aurora",
    },
    {
      IdContribuicao: 8,
      RaUsuario: 2024001,
      TipoDoacao: "Financeira",
      Quantidade: 450,
      Meta: 500,
      Gastos: 20,
      Fonte: "Venda de bolos",
      DataContribuicao: "2026-06-10",
      NomeTime: "Aurora",
    },
    {
      IdContribuicao: 9,
      RaUsuario: 2024001,
      TipoDoacao: "Financeira",
      Quantidade: 800,
      Meta: 1500,
      Gastos: 50,
      Fonte: "Vaquinha online",
      DataContribuicao: "2026-06-11",
      NomeTime: "Aurora",
    },
    {
      IdContribuicao: 10,
      RaUsuario: 2024002,
      TipoDoacao: "Financeira",
      Quantidade: 150,
      Meta: 300,
      Gastos: 10,
      Fonte: "Coleta no semáforo",
      DataContribuicao: "2026-06-12",
      NomeTime: "Horizonte",
    },
    {
      IdContribuicao: 11,
      RaUsuario: 2024001,
      TipoDoacao: "Financeira",
      Quantidade: 5000,
      Meta: 10000,
      Gastos: 400,
      Fonte: "Jantar beneficente",
      DataContribuicao: "2026-06-12",
      NomeTime: "Aurora",
    },
    {
      IdContribuicao: 12,
      RaUsuario: 2024001,
      TipoDoacao: "Financeira",
      Quantidade: 320,
      Meta: 500,
      Gastos: 0,
      Fonte: "Doações recorrentes",
      DataContribuicao: "2026-06-13",
      NomeTime: "Aurora",
    },
    {
      IdContribuicao: 13,
      RaUsuario: 2024001,
      TipoDoacao: "Financeira",
      Quantidade: 2100,
      Meta: 2000,
      Gastos: 150,
      Fonte: "Leilão de itens doados",
      DataContribuicao: "2026-06-14",
      NomeTime: "Aurora",
    },
    {
      IdContribuicao: 14,
      RaUsuario: 2024002,
      TipoDoacao: "Alimenticia",
      Quantidade: 30,
      PesoUnidade: 1.0,
      Gastos: 0,
      Fonte: "Supermercado parceiro",
      DataContribuicao: "2026-06-06",
      NomeAlimento: "Feijão",
      NomeTime: "Horizonte",
      alimentos: [{ NomeAlimento: "Feijão", Pontuacao: 5 }],
    },
    {
      IdContribuicao: 15,
      RaUsuario: 2024001,
      TipoDoacao: "Alimenticia",
      Quantidade: 100,
      PesoUnidade: 0.5,
      Gastos: 0,
      Fonte: "Gincana escolar",
      DataContribuicao: "2026-06-07",
      NomeAlimento: "Macarrão",
      NomeTime: "Aurora",
      alimentos: [{ NomeAlimento: "Macarrão", Pontuacao: 3 }],
    },
    {
      IdContribuicao: 16,
      RaUsuario: 2024001,
      TipoDoacao: "Alimenticia",
      Quantidade: 50,
      PesoUnidade: 1.0,
      Gastos: 0,
      Fonte: "Condomínio residencial",
      DataContribuicao: "2026-06-08",
      NomeAlimento: "Açúcar",
      NomeTime: "Aurora",
      alimentos: [{ NomeAlimento: "Açúcar", Pontuacao: 2 }],
    },
    {
      IdContribuicao: 17,
      RaUsuario: 2024001,
      TipoDoacao: "Alimenticia",
      Quantidade: 20,
      PesoUnidade: 0.9,
      Gastos: 0,
      Fonte: "Campanha porta a porta",
      DataContribuicao: "2026-06-09",
      NomeAlimento: "Óleo de Soja",
      NomeTime: "Aurora",
      alimentos: [{ NomeAlimento: "Óleo de Soja", Pontuacao: 4 }],
    },
    {
      IdContribuicao: 18,
      RaUsuario: 2024002,
      TipoDoacao: "Alimenticia",
      Quantidade: 60,
      PesoUnidade: 1.0,
      Gastos: 0,
      Fonte: "Doação anônima",
      DataContribuicao: "2026-06-10",
      NomeAlimento: "Farinha de Trigo",
      NomeTime: "Horizonte",
      alimentos: [{ NomeAlimento: "Farinha de Trigo", Pontuacao: 3 }],
    },
    {
      IdContribuicao: 19,
      RaUsuario: 2024001,
      TipoDoacao: "Alimenticia",
      Quantidade: 120,
      PesoUnidade: 1.0,
      Gastos: 0,
      Fonte: "Igreja local",
      DataContribuicao: "2026-06-11",
      NomeAlimento: "Leite de Caixinha",
      NomeTime: "Aurora",
      alimentos: [{ NomeAlimento: "Leite de Caixinha", Pontuacao: 2 }],
    },
    {
      IdContribuicao: 20,
      RaUsuario: 2024001,
      TipoDoacao: "Alimenticia",
      Quantidade: 40,
      PesoUnidade: 0.5,
      Gastos: 0,
      Fonte: "Arrecadação na praça",
      DataContribuicao: "2026-06-12",
      NomeAlimento: "Fubá",
      NomeTime: "Aurora",
      alimentos: [{ NomeAlimento: "Fubá", Pontuacao: 2 }],
    },
    {
      IdContribuicao: 21,
      RaUsuario: 2024001,
      TipoDoacao: "Alimenticia",
      Quantidade: 15,
      PesoUnidade: 1.0,
      Gastos: 0,
      Fonte: "Doação direta de moradores",
      DataContribuicao: "2026-06-12",
      NomeAlimento: "Sal",
      NomeTime: "Aurora",
      alimentos: [{ NomeAlimento: "Sal", Pontuacao: 1 }],
    },
    {
      IdContribuicao: 22,
      RaUsuario: 2024002,
      TipoDoacao: "Alimenticia",
      Quantidade: 80,
      PesoUnidade: 0.5,
      Gastos: 0,
      Fonte: "Desafio interclasses",
      DataContribuicao: "2026-06-13",
      NomeAlimento: "Café",
      NomeTime: "Horizonte",
      alimentos: [{ NomeAlimento: "Café", Pontuacao: 5 }],
    },
    {
      IdContribuicao: 23,
      RaUsuario: 2024001,
      TipoDoacao: "Alimenticia",
      Quantidade: 25,
      PesoUnidade: 0.4,
      Gastos: 0,
      Fonte: "Associação de bairro",
      DataContribuicao: "2026-06-14",
      NomeAlimento: "Leite em Pó",
      NomeTime: "Aurora",
      alimentos: [{ NomeAlimento: "Leite em Pó", Pontuacao: 6 }],
    },
  ],
};

function clone<T>(value: T): T {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

export function isMockMode() {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";
}

function loadState(): MockState {
  if (typeof window === "undefined") return clone(seededState);

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return clone(seededState);

  try {
    return JSON.parse(raw) as MockState;
  } catch {
    return clone(seededState);
  }
}

function saveState(state: MockState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function nextId(items: { IdContribuicao?: number; IdMentor?: number }[]) {
  return (
    items.reduce((max, item) => {
      const value = Number(item.IdContribuicao ?? item.IdMentor ?? 0);
      return Math.max(max, value);
    }, 0) + 1
  );
}

export function getMockState() {
  return loadState();
}

export function loginMockUser(RaUsuario: number, SenhaUsuario: string) {
  const state = loadState();
  const user = state.users.find(
    (item) =>
      item.RaUsuario === RaUsuario && item.SenhaUsuario === SenhaUsuario,
  );
  if (!user) throw new Error("Credenciais inválidas.");
  return clone(user);
}

export function loginMockMentor(
  EmailMentor: string,
  SenhaMentor: string,
  isAdmin = false,
) {
  const state = loadState();
  const mentor = state.mentors.find(
    (item) =>
      item.EmailMentor.toLowerCase() === EmailMentor.toLowerCase() &&
      item.SenhaMentor === SenhaMentor &&
      Boolean(item.IsAdmin) === isAdmin,
  );
  if (!mentor) throw new Error("Credenciais inválidas.");
  return clone(mentor);
}

export function registerMockUser(
  input: Omit<MockUser, "SenhaUsuario"> & { SenhaUsuario: string },
) {
  const state = loadState();
  const user = { ...input };
  const existing = state.users.some(
    (item) => item.RaUsuario === user.RaUsuario,
  );
  if (existing) throw new Error("Este R.A. já está cadastrado.");
  state.users.push(user);
  state.teams.push({
    NomeTime: `${user.TurmaUsuario} - ${user.NomeUsuario.split(" ")[0]}`,
    RaUsuario: user.RaUsuario,
    RaAlunos: [user.RaUsuario],
    IdMentor: 101,
  });
  saveState(state);
  return clone(user);
}

export function getMockUser(RaUsuario: number) {
  return clone(
    loadState().users.find((item) => item.RaUsuario === RaUsuario) ?? null,
  );
}

export function getMockTeamByUser(RaUsuario: number) {
  return clone(
    loadState().teams.find((item) => item.RaUsuario === RaUsuario) ?? null,
  );
}

export function getMockMentor(IdMentor: number) {
  return clone(
    loadState().mentors.find((item) => item.IdMentor === IdMentor) ?? null,
  );
}

export function getMockMentorByEmail(email: string) {
  const lower = email.toLowerCase();
  return clone(
    loadState().mentors.find(
      (item) => item.EmailMentor.toLowerCase() === lower,
    ) ?? null,
  );
}

export function getMockContributions(RaUsuario?: number) {
  const state = loadState();
  const items = RaUsuario
    ? state.contributions.filter((item) => item.RaUsuario === RaUsuario)
    : state.contributions;
  return clone(items.sort((a, b) => b.IdContribuicao - a.IdContribuicao));
}

export function createMockContribution(
  contribution: Omit<
    MockContribution,
    "IdContribuicao" | "DataContribuicao"
  > & {
    DataContribuicao?: string;
  },
) {
  const state = loadState();
  const team = state.teams.find(
    (item) => item.RaUsuario === contribution.RaUsuario,
  );
  const record: MockContribution = {
    ...contribution,
    IdContribuicao: nextId(state.contributions),
    DataContribuicao:
      contribution.DataContribuicao ?? new Date().toISOString().slice(0, 10),
    NomeTime: team?.NomeTime ?? contribution.NomeTime,
  };
  state.contributions.unshift(record);
  saveState(state);
  return clone(record);
}

export function getMockMentorTeam(RaUsuario: number, IdMentor: number) {
  const state = loadState();
  const team = state.teams.find(
    (item) => item.RaUsuario === RaUsuario && item.IdMentor === IdMentor,
  );
  if (!team) return null;
  const mentor =
    state.mentors.find((item) => item.IdMentor === IdMentor) ?? null;
  return { team: clone(team), mentor: clone(mentor) };
}

export function ensureMockMentorForUser(
  RaUsuario: number,
  EmailMentor: string,
) {
  const state = loadState();
  const mentor = state.mentors.find(
    (item) => item.EmailMentor.toLowerCase() === EmailMentor.toLowerCase(),
  );
  const team = state.teams.find((item) => item.RaUsuario === RaUsuario);
  if (!mentor || !team) throw new Error("Mentor ou time não encontrado.");
  team.IdMentor = mentor.IdMentor;
  saveState(state);
  return clone({ IdMentor: mentor.IdMentor });
}

export function ensureMockAdminForUser(EmailMentor: string) {
  const mentor = getMockMentorByEmail(EmailMentor);
  if (!mentor) throw new Error("Admin não encontrado.");
  return clone({ IdMentor: mentor.IdMentor });
}
