import express from "express";
import { postSchema, type Post } from "../schemas/postsSchema";
import { randomUUIDv7 } from "bun";
import {
  deletePost,
  getPostById,
  getPosts,
  getPostByUserId,
  makePost,
} from "../services/postsServices";
import jwtMiddleware from "../middlewares/jwtValidation";

const router = express.Router();

router.get("/posts/user/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing user ID" });
  }

  const { success, data, message, error } = await getPostByUserId(id);

  if (!success) {
    return res.status(404).json({ error: message, details: error });
  }

  return res.status(200).json({
    message: "Posts found successfully",
    posts: data,
  });
});

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

router.post("/posts", jwtMiddleware, async (req, res) => {
  const { title, content } = req.body;
  // get user id from token
  const user_id = (req as any).user.id;

  const post: Post = {
    id: randomUUIDv7(),
    title,
    content,
    user_id: user_id,
    created_at: new Date(),
  };

  if (!title || !content) {
    return res.status(400).json({ error: "Missing title or content" });
  }

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

  return res.status(201).json({ success: true, post });
});

router.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;

  const { success, message, error } = await deletePost(id);

  if (!success) {
    return res.status(404).json({ error: message, details: error });
  }

  return res.status(200).json({ message: "Post deleted successfully" });
});

export default router;
