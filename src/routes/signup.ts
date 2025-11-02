import express, { type Request, type Response } from "express";
import { userSchema } from "../schemas/usersSchema";
import { randomUUIDv7 } from "bun";
import { signupUser } from "../services/usersService";

const router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes" });
  }

  const id = randomUUIDv7();

  const validation = userSchema.safeParse({ id, username, email, password });

  if (!validation.success) {
    console.error("Erro de validação:", validation.error.message);
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const hashPass = await Bun.password.hash(password);

  const user = {
    id,
    username,
    email,
    password: hashPass,
  };

  const result = await signupUser(user);

  if (!result.success) {
    return res.status(409).json({ error: result.message });
  }

  res.cookie("token", result.token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24,
  });

  return res.status(201).json({ success: true, id: user.id });
});

export default router;
