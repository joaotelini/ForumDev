import express from "express";
import { postSchema, type Post } from "../schemas/postsSchema";
import { randomUUIDv7 } from "bun";
import {
  deletePost,
  getPostById,
  getPosts,
  getPostsByUserId,
  createPost,
} from "../services/postsServices";

const router = express.Router();

router.get("/posts/user/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing user ID" });
  }

  const { success, data, message, error } = await getPostsByUserId(id);

  if (!success) {
    return res.status(404).json({ error: message, details: error });
  }

  return res.status(200).json({
    success: true,
    posts: data,
  });
});

router.get("/posts", async (req, res) => {
  const { success, data, message, error } = await getPosts();

  if (!success) {
    return res.status(404).json({ error: message, details: error });
  }

  return res.status(200).json({
    success: true,
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
    success: true,
    post: data,
  });
});

router.post("/posts", async (req, res) => {
  const { title, content } = req.body;
  // get user id from token
  const user_id = (req as any).user.id;
  if (!title || !content) {
    return res.status(400).json({ error: "Missing title or content" });
  }

  const post: Post = {
    id: randomUUIDv7(),
    title,
    content,
    user_id: user_id,
    created_at: new Date(),
  };

  const validation = postSchema.safeParse(post);
  if (!validation.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: validation.error.flatten(),
    });
  }

  const { success, message, error } = await createPost(post);

  if (!success) {
    return res.status(500).json({ error: message, details: error });
  }

  return res.status(201).json({ success: true, post });
});

router.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;

  const { success, message, error } = await deletePost(id);

  if (!success) {
    return res.status(404).json({ error: message, details: error });
  }

  return res.status(200).json({ success: true, message: "Post deleted" });
});

export default router;
