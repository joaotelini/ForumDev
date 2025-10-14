import express from "express";
import { userSchema } from "../schemas/usersSchema";
import { randomUUIDv7 } from "bun";
import { signinUser } from "../services/usersService";

const router = express.Router();

router.post("/signin", async (req, res) => {
  const { username, email, password } = req.body;

  const hashPass = await Bun.password.hash(password);

  const user = {
    id: randomUUIDv7(),
    username,
    email,
    password: hashPass,
  };

  // validação com Zod
  const validation = userSchema.safeParse(user);
  if (!validation.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: validation,
    });
  }

  const { success, message, error } = await signinUser(user);

  if (!success) {
    return res.status(500).json({ error: message, details: error });
  }

  return res.status(201).json({ success: true, user: user.id });
});

export default router;
