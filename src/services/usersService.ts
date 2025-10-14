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

export const getUserById = async (
  id: User["id"]
): Promise<ServiceResponse<User>> => {
  try {
    const rows = await db<
      User[]
    >`SELECT id, username FROM users WHERE id = ${id}`;

    if (rows.length === 0) {
      return { success: false, message: "Usuário não encontrado" };
    }

    return { success: true, data: rows[0] };
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return { success: false, message: "Erro ao buscar usuário", error };
  }
};
