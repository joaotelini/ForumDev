import z from "zod";

export const postSchema = z.object({
  id: z.uuidv7(),
  title: z.string().max(100),
  content: z.string().max(1000),
  user_id: z.uuidv7(),
  created_at: z.date().default(() => new Date()),
});

export type Post = z.infer<typeof postSchema>;
