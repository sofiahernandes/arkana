// Receipt controller. Attaches uploaded files to contributions and exposes receipt lookup endpoints.
import { cloudinary } from "../configs/uploadconfig.js";
import { prisma } from "../../prisma/lib/prisma.js";
import { deleteImageFromUrl } from "../configs/cloudinaryHelper.js";

const receiptController = {
  // POST /api/comprovante/:IdContribuicaoFinanciera
  // Attaches or replaces the receipt for a financial contribution and removes the previous Cloudinary asset when needed.
  addReceiptAtContribution: async (req, res) => {
    try {
      const { IdContribuicaoFinanceira } = req.params;
      const contributionId = parseInt(IdContribuicaoFinanceira, 10);

      if (isNaN(contributionId)) {
        return res.status(400).json({ error: "ID de contribuição inválido." });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado." });
      }
      const imagemUrl = req.file.path;

      const contribuicaoExiste =
        await prisma.contribuicao_Financeira.findUnique({
          where: { IdContribuicaoFinanceira: contributionId },
          include: { comprovante: true },
        });

      if (!contribuicaoExiste) {
        return res.status(404).json({ error: "Contribuição não encontrada" });
      }

      let comprovanteAtualizado;

      if (contribuicaoExiste.IdComprovante) {
        const comprovanteAntigo = contribuicaoExiste.comprovante;

        if (comprovanteAntigo.Imagem) {
          await deleteImageFromUrl(cloudinary, comprovanteAntigo.Imagem);
        }

        comprovanteAtualizado = await prisma.comprovante.update({
          where: { IdComprovante: contribuicaoExiste.IdComprovante },
          data: { Imagem: imagemUrl },
        });
      } else {
        comprovanteAtualizado = await prisma.comprovante.create({
          data: { Imagem: imagemUrl },
        });

        await prisma.contribuicao_Financeira.update({
          where: { IdContribuicaoFinanceira: contributionId },
          data: { IdComprovante: comprovanteAtualizado.IdComprovante },
        });
      }

      const contribuicaoFinalizada =
        await prisma.contribuicao_Financeira.findUnique({
          where: { IdContribuicaoFinanceira: contributionId },
          include: {
            comprovante: true,
            usuario: {
              select: {
                RaUsuario: true,
                NomeUsuario: true,
                EmailUsuario: true,
              },
            },
          },
        });

      res.status(200).json({
        message: "Comprovante atualizado com sucesso!",
        data: { ...contribuicaoFinalizada, TipoDoacao: "Financeira" },
      });
    } catch (error) {
      res.status(500).json({
        error: "Erro ao adicionar comprovante",
        details: error.message,
      });
    }
  },
  // Mirrors the same receipt replacement flow for food contributions.
  addFoodReceipt: async (req, res) => {
    try {
      const { IdContribuicaoAlimenticia } = req.params;
      const contributionId = parseInt(IdContribuicaoAlimenticia, 10);

      if (isNaN(contributionId)) {
        return res.status(400).json({ error: "ID de contribuição inválido." });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado." });
      }
      const imagemUrl = req.file.path;

      const contribuicaoExiste =
        await prisma.Contribuicao_Alimenticia.findUnique({
          where: { IdContribuicaoAlimenticia: contributionId },
          include: { comprovante: true },
        });

      if (!contribuicaoExiste) {
        return res.status(404).json({ error: "Contribuição não encontrada" });
      }

      let comprovanteAtualizado;

      if (contribuicaoExiste.IdComprovante) {
        const comprovanteAntigo = contribuicaoExiste.comprovante;

        if (comprovanteAntigo.Imagem) {
          await deleteImageFromUrl(cloudinary, comprovanteAntigo.Imagem);
        }

        comprovanteAtualizado = await prisma.comprovante.update({
          where: { IdComprovante: contribuicaoExiste.IdComprovante },
          data: { Imagem: imagemUrl },
        });
      } else {
        comprovanteAtualizado = await prisma.comprovante.create({
          data: { Imagem: imagemUrl },
        });

        await prisma.Contribuicao_Alimenticia.update({
          where: { IdContribuicaoAlimenticia: contributionId },
          data: { IdComprovante: comprovanteAtualizado.IdComprovante },
        });
      }

      const contribuicaoFinalizada =
        await prisma.contribuicao_Alimenticia.findUnique({
          where: { IdContribuicaoAlimenticia: contributionId },
          include: {
            comprovante: true,
            usuario: {
              select: {
                RaUsuario: true,
                NomeUsuario: true,
                EmailUsuario: true,
              },
            },
          },
        });

      res.status(200).json({
        message: "Comprovante atualizado com sucesso!",
        data: { ...contribuicaoFinalizada, TipoDoacao: "Financeira" },
      });
    } catch (error) {
      res.status(500).json({
        error: "Erro ao adicionar comprovante",
        details: error.message,
      });
    }
  },

  // GET /api/comprovante/usuario/:raUsuario
  // Returns every receipt associated with the participant's financial contributions, newest first.
  receiptByRA: async (req, res) => {
    try {
      const { RaUsuario } = req.params;

      const comprovantes = await prisma.contribuicao_Financeira.findMany({
        where: { RaUsuario: parseInt(RaUsuario, 10) },
        include: {
          comprovante: true,
          usuario: {
            select: {
              RaUsuario: true,
              NomeUsuario: true,
              EmailUsuario: true,
            },
          },
        },
        orderBy: { DataContribuicao: "desc" },
      });

      if (comprovantes.length === 0) {
        return res.status(404).json({
          error: "Nenhum comprovante encontrado para este usuário",
        });
      }

      res.json(comprovantes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/comprovante/:IdComprovante
  // Resolves one receipt together with the linked contribution and user metadata for detailed inspection.
  receiptById: async (req, res) => {
    try {
      const { IdComprovante } = req.params;
      const receiptId = parseInt(IdComprovante, 10);

      if (isNaN(receiptId)) {
        return res.status(400).json({ error: "ID de comprovante inválido." });
      }

      const comprovante = await prisma.comprovante.findUnique({
        where: { IdComprovante: receiptId },
        include: {
          contribuicao_financeira: {
            include: {
              usuario: {
                select: {
                  RaUsuario: true,
                  NomeUsuario: true,
                  EmailUsuario: true,
                },
              },
            },
          },
        },
      });

      if (!comprovante) {
        return res.status(404).json({
          error: "Comprovante não encontrado",
        });
      }

      res.json(comprovante);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lists every stored receipt for administrative views.
  getAllReceipts: async (_, res) => {
    try {
      const comprovantes = await prisma.comprovante.findMany({
        include: {
          contribuicao_financeira: {
            include: {
              usuario: {
                select: {
                  RaUsuario: true,
                  NomeUsuario: true,
                  EmailUsuario: true,
                },
              },
            },
          },
        },
        orderBy: { IdComprovante: "desc" },
      });

      res.json(comprovantes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE /api/comprovante/:IdComprovante
  // Removes the receipt record and its Cloudinary asset so orphaned files do not accumulate.
  deleteReceiptById: async (req, res) => {
    try {
      const { IdComprovante } = req.params;
      const receiptId = parseInt(IdComprovante, 10);

      if (isNaN(receiptId)) {
        return res.status(400).json({ error: "ID de comprovante inválido." });
      }

      const comprovante = await prisma.comprovante.findUnique({
        where: { IdComprovante: receiptId },
        include: { contribuicao_financeira: true },
      });

      if (!comprovante) {
        return res.status(404).json({ error: "Comprovante não encontrado" });
      }
      if (comprovante.contribuicao_financeira) {
        await prisma.contribuicao_Financeira.update({
          where: {
            IdContribuicaoFinanceira:
              comprovante.contribuicao_financeira.IdContribuicaoFinanceira,
          },
          data: { IdComprovante: null },
        });
      }

      if (comprovante.Imagem) {
        await deleteImageFromUrl(cloudinary, comprovante.Imagem);
      }
      await prisma.comprovante.delete({
        where: { IdComprovante: receiptId },
      });

      res.status(200).json({
        message: "Comprovante excluído com sucesso!",
        id: receiptId,
      });
    } catch (error) {
      if (error.code === "P2003") {
        return res.status(409).json({
          error:
            "Não é possível deletar: comprovante vinculado a uma contribuição",
        });
      }

      res.status(500).json({
        error: "Erro ao deletar comprovante",
        details: error.message,
      });
    }
  },
};

export default receiptController;
