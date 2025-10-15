import jwt from "jsonwebtoken";
import "dotenv/config";
import type { NextFunction, Request, Response } from "express";

const JWT_SECRET = process.env.SECRET_KEY_JWT;

const jwtMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Bearer token" });
  }

  const token = authHeader.split(" ")[1];

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
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default jwtMiddleware;
