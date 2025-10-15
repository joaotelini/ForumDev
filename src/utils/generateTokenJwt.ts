import jwt from "jsonwebtoken";
import "dotenv/config";
import type { User } from "../schemas/usersSchema";

const generateTokenJwt = (userId: User["id"]) => {
  const key = process.env.SECRET_KEY_JWT;

  if (!key || typeof key !== "string") {
    throw new Error("SECRET_KEY_JWT is not defined or not a string");
  }

  return jwt.sign({ id: userId }, key, { expiresIn: "1h" });
};

export default generateTokenJwt;
