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
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error("Erro ao verificar JWT:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default jwtMiddleware;
