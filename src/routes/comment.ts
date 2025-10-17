import express from "express";
import { commentSchema, type Comment } from "../schemas/commentsSchema";
import {
  createComment,
  getCommentsByPostId,
} from "../services/commentsService";
import { randomUUIDv7 } from "bun";

const router = express.Router();

router.post("/comment/:post_id", async (req, res) => {
  const { post_id } = req.params;
  const { content } = req.body;
  const user_id = (req as any).user.id;

  if (!post_id || !content) {
    return res.status(400).json({ error: "Missing post ID or content" });
  }

  const comment: Comment = {
    id: randomUUIDv7(),
    content,
    post_id: post_id,
    user_id: user_id,
    created_at: new Date(),
  };

  const validation = commentSchema.safeParse(comment);

  if (!validation.success) {
    console.log(validation.error.message);
    return res.status(400).json({
      error: "Erro ao criar comentário, tente novamente",
    });
  }

  const result = await createComment(comment);

  if (!result.success) {
    return res
      .status(400)
      .json({ error: result.message, details: result.error });
  }

  return res.status(201).json({ sucess: true, data: result.data });
});

router.get("/post/:post_id/comment", async (req, res) => {
  const { post_id } = req.params;

  if (!post_id) {
    return res.status(400).json({ error: "Missing post ID" });
  }

  const { success, data, message, error } = await getCommentsByPostId(post_id);

  if (!success) {
    return res.status(404).json({ error: message, details: error });
  }

  return res.status(200).json({
    success: true,
    comments: data,
  });
});

export default router;
