import db from "../database/connection";
import type { Login, User } from "../schemas/usersSchema";
import type { ServiceResponse } from "../types/serviceResponse";
import { validatePassword } from "../utils/validatePassword";
import generateTokenJwt from "../utils/generateTokenJwt";
import { checkUserExists } from "../utils/checkUserExists";

export const signupUser = async (
  user: User
): Promise<ServiceResponse<User>> => {
  try {
    const userExists = await checkUserExists(user.email, user.username);

    if (userExists) {
      return { success: false, message: "Usuário ja cadastrado" };
    }

    const result = await db`INSERT INTO users ${db(user)}`;

    if (result.affectedRows === 0) {
      return { success: false, message: "Erro ao criar usuário" };
    }

    const token = generateTokenJwt(user.id);

    return {
      success: true,
      data: user,
      token: token,
    };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return { success: false, message: "Erro ao criar usuário", error };
  }
};

export const loginUser = async (
  user: Login
): Promise<ServiceResponse<Omit<User, "password">>> => {
  try {
    const userExists = await checkUserExists(user.email);

    if (userExists === null) {
      return { success: false, message: "Usuário ou senha incorretos" };
    }

    const isPasswordValid = await validatePassword(
      user.password,
      userExists.password
    );

    if (!userExists || !isPasswordValid) {
      return { success: false, message: "Usuário ou senha incorretos" };
    }

    const { password: hash, ...userData } = userExists;

    const token = generateTokenJwt(userData.id);

    return { success: true, data: userData, token: token };
  } catch (error) {
    console.error("Erro ao logar usuário:", error);
    return { success: false, message: "Erro ao logar usuário", error };
  }
};
