import express from "express";
import { postSchema } from "../schemas/postsSchema";
import type { Post } from "../schemas/postsSchema";
import { randomUUIDv7 } from "bun";
import db from "../database/connection";

const router = express.Router();

router.get("/posts", (req, res) => {
  res.json({
    serverStatus: "Online",
  });
});

router.get("/posts/:id", (req, res) => {});

router.post("/posts", async (req, res) => {
  const { title, content } = req.body;

  const post: Post = {
    id: randomUUIDv7(),
    title,
    content,
  };

  const result = postSchema.safeParse(post);

  if (!result.success) {
    return res.status(400).json({ error: "Bad request" });
  }

  try {
    const query = await db`INSERT INTO posts ${db(post)}`;
    if (query.affectedRows === 0) {
      return res.status(500).json({ error: "Error creating post" });
    }
    return res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

export default router;
