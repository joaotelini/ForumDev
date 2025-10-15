import express from "express";
import postsRoute from "./posts";
import signinRoute from "./signin";
import loginRoute from "./login";
import jwtMiddleware from "../middlewares/jwtValidation";

const router = express.Router();

router.use("/", jwtMiddleware, postsRoute);
router.use("/", signinRoute);
router.use("/", loginRoute);

router.get("/", (req, res) => {
  res.json({
    serverStatus: "Online",
  });
});

export default router;
