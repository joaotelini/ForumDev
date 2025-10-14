import express from "express";
import postsRoute from "./posts";
import signinRoute from "./signin";

const router = express.Router();

router.use("/", postsRoute);
router.use("/", signinRoute);

router.get("/", (req, res) => {
  res.json({
    serverStatus: "Online",
  });
});

export default router;
