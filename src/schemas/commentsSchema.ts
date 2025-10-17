import z from "zod";

export const commentSchema = z.object({
  id: z.uuidv7(),
  content: z.string().max(1000),
  post_id: z.uuidv7(),
  user_id: z.uuidv7(),
  created_at: z.date().default(() => new Date()),
});

export type Comment = z.infer<typeof commentSchema>;
