import z from "zod";

export const postSchema = z.object({
  id: z.uuidv7(),
  title: z.string().max(100),
  content: z.string().max(1000),
});

export type Post = z.infer<typeof postSchema>;
