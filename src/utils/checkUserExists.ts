import type { User } from "../schemas/usersSchema";
import db from "../database/connection";

export const checkUserExists = async (
  email: User["email"],
  username?: User["username"]
): Promise<User | null> => {
  try {
    const rows = await db<
      User[]
    >`SELECT username, email, password FROM users WHERE email = ${email} OR username = ${username}`;
    return rows[0] || null;
  } catch (error) {
    return null;
  }
};
