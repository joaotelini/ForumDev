import db from "../database/connection";

import type { User } from "../schemas/usersSchema";
import type { ServiceResponse } from "../types/serviceResponse";

export const signinUser = async (
  user: User
): Promise<ServiceResponse<User>> => {
  try {
    const result = await db`INSERT INTO users ${db(user)}`;

    if (result.affectedRows === 0) {
      return { success: false, message: "Erro ao criar usuário" };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return { success: false, message: "Erro ao criar usuário", error };
  }
};

export const getUserByEmail = async (
  email: User["email"]
): Promise<User | null> => {
  const rows = await db<User[]>`SELECT * FROM users WHERE email = ${email}`;

  return rows[0] || null;
};
