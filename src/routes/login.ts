import express, { type Request, type Response } from "express";
import { loginSchema } from "../schemas/usersSchema";
import { loginService } from "../services/usersService";
const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = {
    email,
    password,
  };

  const validation = loginSchema.safeParse(user);

  if (!validation.success) {
    return res.status(400).json({
      error: "Erro ao logar, tente novamente",
    });
  }

  const result = await loginService(user);

  if (!result.success) {
    return res.status(401).json({ error: result.message });
  }

  res.cookie("token", result.token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24,
  });

  return res
    .status(200)
    .json({ sucess: result.success, message: "Usuário logado com sucesso" });
});

export default router;
