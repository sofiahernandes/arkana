// Authentication controller. Handles registration, login, password changes, and logout responses.
import { prisma } from "../../prisma/lib/prisma.js";
import bcrypt from "bcrypt";
import { createToken, denyToken } from "../services/tokenServices.js";

// Removes fields that the frontend does not need to manage directly before sending the user payload back in auth responses.
const sanitizeUser = (u) => ({
  RaUsuario: u.RaUsuario,
  SenhaUsuario: u.SenhaUsuario,
  NomeUsuario: u.NomeUsuario,
  EmailUsuario: u.EmailUsuario,
  Turma: u.TurmaUsuario,
  TelefoneUsuario: u.TelefoneUsuario,
});
const authController = {
  // POST /api/register
  // Registers a new participant after validating the payload and hashing the password for storage.
  createUser: async (req, res) => {
    const {
      RaUsuario,
      SenhaUsuario,
      NomeUsuario,
      EmailUsuario,
      TurmaUsuario,
      TelefoneUsuario,
    } = req.body;
    if (
      !RaUsuario ||
      !SenhaUsuario ||
      !NomeUsuario ||
      !EmailUsuario ||
      !TurmaUsuario ||
      !TelefoneUsuario
    ) {
      return res.status(400).json({ error: "Coloque os campos corretamente" });
    }

    try {
      const usuario = await prisma.usuario.findUnique({
        where: {
          RaUsuario: Number(RaUsuario),
        },
      });
      if (usuario) {
        return res.status(409).json({ error: "Usuário já existe" });
      }

      const hashedPassword = await bcrypt.hash(SenhaUsuario, 10);
      const newUser = await prisma.usuario.create({
        data: {
          RaUsuario: Number(RaUsuario),
          SenhaUsuario: hashedPassword,
          NomeUsuario,
          EmailUsuario,
          TurmaUsuario,
          TelefoneUsuario,
        },
      });

      res.status(201).json(sanitizeUser(newUser));
    } catch (err) {
      const isDuplicateError =
        err.message?.toLowerCase().includes("unique constraint") ||
        err.meta?.target?.length > 0 ||
        err.message?.toLowerCase().includes("unique failure");

      if (isDuplicateError) {
        return res.status(409).json({
          error: "Aluno Mentor já existente",
          details: err.meta?.target || err.message,
        });
      }
      return res.status(500).json({
        error: "Erro ao cadastrar Aluno Mentor.",
        details: err.message,
      });
    }
  },

  // POST /api/register/login
  // Validates the participant credentials and returns the signed session token used by protected routes.
  loginUser: async (req, res) => {
    const { RaUsuario, SenhaUsuario } = req.body;

    if (!RaUsuario || !SenhaUsuario) {
      return res.status(400).json({ error: "Coloque os campos corretamente" });
    }

    try {
      const usuario = await prisma.usuario.findUnique({
        where: { RaUsuario: Number(RaUsuario) },
      });

      if (!usuario) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const senhaValida = await bcrypt.compare(
        SenhaUsuario,
        usuario.SenhaUsuario,
      );

      if (!senhaValida) {
        return res
          .status(401)
          .json({ error: "Senha incorreta, tente novamente." });
      }
      const { token } = createToken({ RaUsuario: usuario.RaUsuario });

      res.json({ token, usuario: sanitizeUser(usuario) });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Erro ao fazer login.", details: err.message });
    }
  },

  // PUT /api/resetPassword
  // Replaces the stored password hash with a new one during password reset flows.
  resetPassword: async (req, res) => {
    const { rausuario, newPassword } = req.body;
    if (!rausuario || !newPassword) {
      return res.status(400).json({ error: "Coloque os campos corretamente" });
    }
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.usuario.update({
        where: { RaUsuario: Number(rausuario) },
        data: { SenhaUsuario: hashedPassword },
      });

      res.json({ message: "Senha atualizada com sucesso!" });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Erro ao resetar senha.", details: err.message });
    }
  },

  // POST /api/logOutUser
  // Invalidates the current token by adding its identifier to the in-memory denylist.
  logOutUser: async (req, res) => {
    try {
      const { jti } = req.usuario;
      denyToken(jti);
      return res.status(200).json({ message: "Logout realizado com sucesso!" });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Erro ao fazer logout.", details: err.message });
    }
  },
};

export default authController;
