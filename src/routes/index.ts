import express from "express";
import postsRoute from "./posts";
import usersRoute from "./signin";

const router = express.Router();

router.use("/", postsRoute);
router.use("/", usersRoute);

router.get("/", (req, res) => {
  res.json({
    serverStatus: "Online",
  });
});

export default router;
