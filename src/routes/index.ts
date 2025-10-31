import express from "express";
import postsRoute from "./posts";
import signupUser from "./signup";
import loginRoute from "./login";
import commentRoutes from "./comment";
import jwtMiddleware from "../middlewares/jwtValidation";

const router = express.Router();

router.use("/", signupUser);
router.use("/", loginRoute);
router.use("/", jwtMiddleware, commentRoutes);
router.use("/", jwtMiddleware, postsRoute);

router.get("/", (req, res) => {
  res.json({
    serverStatus: "Online",
  });
});

export default router;
