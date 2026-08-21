// Authentication middleware that reads the request token and blocks protected routes when the session is invalid.
import { verifyToken } from "../services/tokenServices.js";

// Extracts the bearer token, validates it, and exposes the decoded session data to downstream handlers.
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split("")[1];
    if (!token)
      return res
        .status(401)
        .json({ error: "Token necessário (Authorization: Bearer <token>)" });

    const decoded = await verifyToken(token);
    req.user = { id: decoded.id, jti: decoded.jti };
    return next();
  } catch (err) {
    const status = err.message === "Token denylisted" ? 401 : 403;
    return res.status(status).json({ error: "Token inválido ou expirado" });
  }
};
