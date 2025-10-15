import z from "zod";

export const userSchema = z.object({
  id: z.uuidv7(),
  username: z.string().max(50),
  email: z.email(),
  password: z.string().min(8),
});

export type User = z.infer<typeof userSchema>;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type Login = z.infer<typeof loginSchema>;
