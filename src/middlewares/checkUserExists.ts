import type { NextFunction, Request, Response } from "express";
import { getUserByEmail } from "../services/usersService";

export const checkUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const exists = await getUserByEmail(email);
  if (exists) {
    return res.status(400).json({ error: "Email já cadastrado" });
  }
  next();
};
