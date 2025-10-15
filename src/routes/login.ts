import express, { type Request, type Response } from "express";
import { loginSchema } from "../schemas/usersSchema";
import { loginUser } from "../services/usersService";
const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email ou senha incorretos" });
  }

  const user = {
    email,
    password,
  };

  const validation = loginSchema.safeParse(user);

  if (!validation.success) {
    console.log(validation.error.message);
    return res.status(400).json({
      error: "Erro ao logar, tente novamente",
    });
  }

  const result = await loginUser(user);

  if (!result.success) {
    return res.status(401).json({ error: result.message });
  }

  return res.status(200).json({ sucess: result.success, token: result.token });
});

export default router;
