import jwt from "jsonwebtoken";
import "dotenv/config";
import type { NextFunction, Request, Response } from "express";

const JWT_SECRET = process.env.SECRET_KEY_JWT;

const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token; // usa optional chaining

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  if (!JWT_SECRET) {
    console.error("JWT_SECRET não configurado");
    return res.status(500).json({ error: "Erro interno de autenticação" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token expired" });
  }
};

export default jwtMiddleware;
