// Contribution controller. Aggregates financial and food donations into the API shape consumed by the frontend.
import { prisma } from "../../prisma/lib/prisma.js";
import { v4 as uuidv4 } from "uuid";

const contributionController = {
  // GET /api/contributions
  // Lists every contribution, merges the two donation tables, and reshapes them into the unified API contract used by the frontend.
  allContributions: async (_, res) => {
    try {
      const financeContribs = await prisma.contribuicao_Financeira.findMany({
        orderBy: { DataContribuicao: "desc" },
        include: {
          usuario: {
            include: {
              time_usuarios: {
                include: {
                  time: {
                    select: {
                      NomeTime: true,
                    },
                  },
                },
              },
            },
          },
          comprovante: true,
        },
      });

      const foodContribs = await prisma.contribuicao_Alimenticia.findMany({
        orderBy: { DataContribuicao: "desc" },
        include: {
          usuario: {
            include: {
              time_usuarios: {
                include: {
                  time: {
                    select: {
                      NomeTime: true,
                    },
                  },
                },
              },
            },
          },
          comprovante: true,
          alimento: {
            select: {
              NomeAlimento: true,
              Pontuacao: true,
            },
          },
        },
      });

      // Normalizes both Prisma result sets into a single list so the frontend can render one contribution model.
      const allContribs = [
        ...financeContribs.map((contrib) => ({
          IdContribuicao: contrib.IdContribuicaoFinanceira,
          RaUsuario: contrib.RaUsuario,
          TipoDoacao: "Financeira",
          Quantidade: Number(contrib.Quantidade),
          Meta: contrib.Meta ? Number(contrib.Meta) : null,
          Gastos: contrib.Gastos ? Number(contrib.Gastos) : null,
          Fonte: contrib.Fonte,
          DataContribuicao: contrib.DataContribuicao,
          comprovante: contrib.comprovante
            ? {
                IdComprovante: contrib.comprovante.IdComprovante,
                Imagem: contrib.comprovante.Imagem,
              }
            : null,
          alimentos: [],
          PesoUnidade: 0,
          uuid: contrib.uuid,
          NomeTime:
            contrib.usuario?.time_usuarios?.[0]?.time?.NomeTime || "Sem time",
        })),
        ...foodContribs.map((contrib) => ({
          IdContribuicao: contrib.IdContribuicaoAlimenticia,
          RaUsuario: contrib.RaUsuario,
          TipoDoacao: "Alimenticia",
          Quantidade: Number(contrib.Quantidade),
          Meta: contrib.Meta ? Number(contrib.Meta) : null,
          Gastos: contrib.Gastos ? Number(contrib.Gastos) : null,
          Fonte: contrib.Fonte,
          DataContribuicao: contrib.DataContribuicao,
          comprovante: contrib.comprovante
            ? {
                IdComprovante: contrib.comprovante.IdComprovante,
                Imagem: contrib.comprovante.Imagem,
              }
            : null,
          alimentos: contrib.alimento
            ? [
                {
                  NomeAlimento: contrib.alimento.NomeAlimento,
                  Pontuacao: contrib.alimento.Pontuacao,
                  Quantidade: contrib.Quantidade,
                },
              ]
            : [],
          PesoUnidade: contrib.PesoUnidade ? Number(contrib.PesoUnidade) : 0,
          uuid: contrib.uuid,
          NomeTime:
            contrib.usuario?.time_usuarios?.[0]?.time?.NomeTime || "Sem time",
        })),
      ];

      allContribs.sort(
        (a, b) => new Date(b.DataContribuicao) - new Date(a.DataContribuicao),
      );

      res.json(allContribs);
    } catch (err) {
      res.status(500).json({
        error: "Erro ao listar contribuições.",
        details: err.message,
      });
    }
  },

  // GET /api/contributions/:RaUsuario
  // Returns only the contributions owned by one participant while keeping the same normalized response shape.
  getContributionsByRa: async (req, res) => {
    try {
      const { RaUsuario } = req.params;

      const financeContribs = await prisma.contribuicao_Financeira.findMany({
        where: { RaUsuario: Number(RaUsuario) },
        orderBy: { DataContribuicao: "desc" },
        include: {
          usuario: true,
          comprovante: true,
        },
      });

      const foodContribs = await prisma.contribuicao_Alimenticia.findMany({
        where: { RaUsuario: Number(RaUsuario) },
        orderBy: { DataContribuicao: "desc" },
        include: {
          usuario: true,
          comprovante: true,
          alimento: {
            select: {
              NomeAlimento: true,
              Pontuacao: true,
            },
          },
        },
      });

      const allContribs = [
        ...financeContribs.map((contrib) => ({
          IdContribuicao: contrib.IdContribuicaoFinanceira,
          RaUsuario: contrib.RaUsuario,
          TipoDoacao: "Financeira",
          Quantidade: Number(contrib.Quantidade),
          Meta: contrib.Meta ? Number(contrib.Meta) : null,
          Gastos: contrib.Gastos ? Number(contrib.Gastos) : null,
          Fonte: contrib.Fonte,
          DataContribuicao: contrib.DataContribuicao,
          comprovante: contrib.comprovante
            ? {
                IdComprovante: contrib.comprovante.IdComprovante,
                Imagem: contrib.comprovante.Imagem,
              }
            : null,
          alimentos: [],
          PesoUnidade: 0,
          uuid: contrib.uuid,
        })),
        ...foodContribs.map((contrib) => ({
          IdContribuicao: contrib.IdContribuicaoAlimenticia,
          RaUsuario: contrib.RaUsuario,
          TipoDoacao: "Alimenticia",
          Quantidade: Number(contrib.Quantidade),
          Meta: contrib.Meta ? Number(contrib.Meta) : null,
          Gastos: contrib.Gastos ? Number(contrib.Gastos) : null,
          Fonte: contrib.Fonte,
          DataContribuicao: contrib.DataContribuicao,
          comprovante: contrib.comprovante
            ? {
                IdComprovante: contrib.comprovante.IdComprovante,
                Imagem: contrib.comprovante.Imagem,
              }
            : null,
          alimentos: contrib.alimento
            ? [
                {
                  NomeAlimento: contrib.alimento.NomeAlimento,
                  Pontuacao: contrib.alimento.Pontuacao,
                  Quantidade: contrib.Quantidade,
                },
              ]
            : [],
          PesoUnidade: contrib.PesoUnidade ? Number(contrib.PesoUnidade) : 0,
          uuid: contrib.uuid,
        })),
      ];

      if (allContribs.length === 0) {
        return res.status(404).json({
          error: "Nenhuma contribuição encontrada para esse usuário.",
        });
      }

      allContribs.sort(
        (a, b) => new Date(b.DataContribuicao) - new Date(a.DataContribuicao),
      );
      res.json(allContribs);
    } catch (err) {
      console.error("Erro ao buscar contribuições por RA:", err);
      res.status(500).json({
        error: "Erro ao buscar contribuições por RaUsuario.",
        details: err.message,
      });
    }
  },

  // GET /api/contributions/edition/:editionNumber
  // Converts the edition number into a semester date range and filters both contribution tables by that window.
  getContributionsByEdition: async (req, res) => {
    try {
      const { editionNumber } = req.params;
      const edition = Number(editionNumber);

      const baseYear = 2025 + Math.floor((edition - 7) / 2);
      const isFirstSemester = edition % 2 === 1;

      const startDate = new Date(baseYear, isFirstSemester ? 0 : 7, 1);
      const endDate = new Date(
        baseYear,
        isFirstSemester ? 6 : 11,
        31,
        23,
        59,
        59,
      );

      const financeContribs = await prisma.contribuicao_Financeira.findMany({
        where: {
          DataContribuicao: { gte: startDate, lte: endDate },
        },
        orderBy: { DataContribuicao: "desc" },
        include: { usuario: true },
      });

      const foodContribs = await prisma.contribuicao_Alimenticia.findMany({
        where: {
          DataContribuicao: { gte: startDate, lte: endDate },
        },
        orderBy: { DataContribuicao: "desc" },
        include: {
          usuario: true,
          contribuicoes_alimento: {
            include: { alimento: true },
          },
        },
      });

      const allContribs = [
        ...financeContribs.map((c) => ({ ...c, TipoDoacao: "Financeira" })),
        ...foodContribs.map((c) => ({ ...c, TipoDoacao: "Alimenticia" })),
      ];

      if (allContribs.length === 0) {
        return res.status(404).json({
          message: "Nenhuma contribuição encontrada para essa edição.",
        });
      }

      allContribs.sort(
        (a, b) => new Date(b.DataContribuicao) - new Date(a.DataContribuicao),
      );

      res.json(allContribs);
    } catch (err) {
      console.error("Erro ao buscar contribuições por edição:", err);
      res.status(500).json({
        error: "Erro ao buscar contribuições por edição.",
        details: err.message,
      });
    }
  },

  // POST /api/createContribution
  // Creates either a financial or food contribution based on the incoming donation type and keeps the insert transactional.
  createContribution: async (req, res) => {
    const {
      RaUsuario,
      TipoDoacao,
      Quantidade,
      Meta,
      Gastos,
      Fonte,
      PesoUnidade,
      IdAlimento,
      alimentos,
      uuid,
      Imagem,
    } = req.body;

    if (!RaUsuario || !TipoDoacao) {
      return res.status(400).json({
        error: "RaUsuario e TipoDoacao são obrigatórios.",
      });
    }

    try {
      if (TipoDoacao === "Financeira") {
        if (!Quantidade || !Fonte || Gastos === undefined) {
          return res.status(400).json({
            error:
              "Quantidade, Fonte e Gastos são obrigatórios para doação financeira.",
          });
        }

        // The financial branch writes one row and returns the created record for the optional receipt upload step.
        const resultado = await prisma.$transaction(async (tx) => {
          let comprovanteId = null;
          if (Imagem) {
            const comprovante = await tx.comprovante.create({
              data: {
                Imagem: Imagem,
              },
            });
            comprovanteId = comprovante.IdComprovante;
          }

          const contribuicao = await tx.contribuicao_Financeira.create({
            data: {
              uuid: uuidv4(),
              RaUsuario: Number(RaUsuario),
              TipoDoacao,
              Quantidade: Number(Quantidade),
              Meta: Meta ? Number(Meta) : null,
              Gastos: Number(Gastos),
              Fonte,
              IdComprovante: comprovanteId,
            },
            include: {
              usuario: {
                select: {
                  RaUsuario: true,
                  NomeUsuario: true,
                  EmailUsuario: true,
                },
              },
              comprovante: true,
            },
          });

          return contribuicao;
        });

        return res.status(201).json({
          message: "Contribuição financeira criada com sucesso!",
          data: { ...resultado, TipoDoacao: "Financeira" },
        });
      } else if (TipoDoacao === "Alimenticia") {
        if (!PesoUnidade || !Quantidade || !IdAlimento) {
          return res.status(400).json({
            error: "IdAlimento, Quantidade e PesoUnidade são obrigatórios.",
          });
        }

        const alimentoExiste = await prisma.alimento.findUnique({
          where: { IdAlimento: Number(IdAlimento) },
        });

        if (!alimentoExiste) {
          return res.status(400).json({
            error: `Alimento com ID ${IdAlimento} não encontrado.`,
          });
        }

        // The food branch stores the contribution plus its food relation inside the same transaction.
        const resultado = await prisma.$transaction(async (tx) => {
          let comprovanteId = null;
          if (Imagem) {
            const comprovante = await tx.comprovante.create({
              data: {
                Imagem: Imagem,
              },
            });
            comprovanteId = comprovante.IdComprovante;
          }
          const contribuicao = await tx.contribuicao_Alimenticia.create({
            data: {
              uuid: uuidv4(),
              RaUsuario: Number(RaUsuario),
              TipoDoacao,
              Quantidade: Number(Quantidade),
              PesoUnidade: Number(PesoUnidade),
              Gastos: Gastos ? Number(Gastos) : 0,
              Meta: Meta ? Number(Meta) : null,
              Fonte: Fonte || null,
              IdAlimento: Number(IdAlimento),
              IdComprovante: comprovanteId,
            },
            include: {
              comprovante: true,
            },
          });

          return contribuicao;
        });
        const contribuicaoCompleta =
          await prisma.contribuicao_Alimenticia.findUnique({
            where: {
              IdContribuicaoAlimenticia: resultado.IdContribuicaoAlimenticia,
            },
            include: {
              usuario: {
                select: {
                  RaUsuario: true,
                  NomeUsuario: true,
                  EmailUsuario: true,
                },
              },
              alimento: true,
            },
          });

        return res.status(201).json({
          message: "Contribuição alimentícia criada com sucesso!",
          data: contribuicaoCompleta,
        });
      }
      return res.status(400).json({
        error: "TipoDoacao inválido. Use 'Financeira' ou 'Alimenticia'.",
      });
    } catch (err) {
      return res.status(500).json({
        error: "Erro ao criar contribuição.",
        details: err.message,
        code: err.code,
      });
    }
  },

  // DELETE /api/:TipoDoacao/:IdContribuicao
  // Deletes the requested contribution by type so the UI can use one endpoint for both donation categories.
  deleteContribution: async (req, res) => {
    const { TipoDoacao, IdContribuicao } = req.params;

    try {
      const id = Number(IdContribuicao);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido." });
      }

      let contribuicao;

      if (TipoDoacao === "Financeira") {
        contribuicao = await prisma.contribuicao_Financeira.delete({
          where: { IdContribuicaoFinanceira: id },
        });
      } else if (TipoDoacao === "Alimenticia") {
        contribuicao = await prisma.contribuicao_Alimenticia.delete({
          where: { IdContribuicaoAlimenticia: id },
        });
      } else {
        return res.status(400).json({
          error: "Tipo de doação inválido. Use 'Financeira' ou 'Alimenticia'.",
        });
      }

      return res.status(200).json({
        message: "Contribuição deletada com sucesso!",
        data: contribuicao,
      });
    } catch (err) {
      console.error("Erro ao deletar contribuição:", err);
      return res.status(500).json({
        error: "Erro ao deletar contribuição.",
        details: err.message,
      });
    }
  },
};

export default contributionController;
