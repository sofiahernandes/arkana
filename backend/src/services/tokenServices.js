// Token helpers used by authentication flows to issue, validate, and revoke access tokens.
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const denylist = new Set();

// Signs a JWT and adds a token identifier so logout can revoke the session later through the denylist.
export const createToken = (payload, options = {}) => {
  const jti = uuidv4;
  const token = jwt.sign({ ...payload, jti }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "2h",
    ...options,
  });
  return { token, jti };
};

export const isDenied = (jti) => denylist.has(jti);

// Stores revoked token ids in memory for the lifetime of the backend process.
export const denyToken = (jti) => {
  if (jti) denylist.add(jti);
};

// Verifies the JWT signature and then rejects tokens that were explicitly revoked after login.
export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);
      if (isDenied(decoded.jti)) return reject(new Error("Token denylisted"));
      return resolve(decoded);
    });
  });
