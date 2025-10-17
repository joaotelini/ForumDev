import express from "express";
import { userSchema } from "../schemas/usersSchema";
import { checkUserExists } from "../utils/checkUserExists";
import { randomUUIDv7 } from "bun";
import { signinUser } from "../services/usersService";

const router = express.Router();

router.post("/signin", checkUserExists, async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes" });
  }

  const id = randomUUIDv7();

  const validation = userSchema.safeParse({ id, username, email, password });

  if (!validation.success) {
    console.log(validation.error.message);
    return res.status(400).json({
      error: "Erro ao criar usuário, tente novamente",
    });
  }

  const hashPass = await Bun.password.hash(password);

  const user = {
    id,
    username,
    email,
    password: hashPass,
  };

  await signinUser(user);

  return res.status(201).json({ success: true, id: user.id });
});

export default router;
