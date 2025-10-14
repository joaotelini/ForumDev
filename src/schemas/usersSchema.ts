import z from "zod";

export const userSchema = z.object({
  id: z.uuidv7(),
  username: z.string().max(50),
  email: z.email(),
  password: z.string().min(8),
});

export type User = z.infer<typeof userSchema>;
