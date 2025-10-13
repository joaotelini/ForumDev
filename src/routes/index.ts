import express from "express";
import postsRoute from "./posts";

const router = express.Router();

router.use("/", postsRoute);

router.get("/", (req, res) => {
  res.json({
    serverStatus: "Online",
  });
});

export default router;
