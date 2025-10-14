import express from "express";
import { postSchema, type Post } from "../schemas/postsSchema";
import { randomUUIDv7 } from "bun";
import { getPostById, getPosts, makePost } from "../services/postsServices";

const router = express.Router();

router.get("/posts", async (req, res) => {
  const { success, data, message, error } = await getPosts();

  if (!success) {
    return res.status(404).json({ error: message, details: error });
  }

  return res.status(200).json({
    message: "Posts found successfully",
    posts: data,
  });
});

router.get("/posts/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing post ID" });
  }

  const { success, data, message, error } = await getPostById(id);

  if (!success) {
    return res.status(404).json({ error: message, details: error });
  }

  return res.status(200).json({
    message: "Post found successfully",
    post: data,
  });
});

router.post("/posts", async (req, res) => {
  const { title, content } = req.body;

  const post: Post = {
    id: randomUUIDv7(),
    title,
    content,
  };

  // validação com Zod
  const validation = postSchema.safeParse(post);
  if (!validation.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: validation.error.flatten(),
    });
  }

  const { success, message, error } = await makePost(post);

  if (!success) {
    return res.status(500).json({ error: message, details: error });
  }

  return res.status(201).json({ message });
});

export default router;
