import db from "../database/connection";
import type { Login, User } from "../schemas/usersSchema";
import type { ServiceResponse } from "../types/serviceResponse";
import { validatePassword } from "../middlewares/validatePassword";
import generateTokenJwt from "../utils/generateTokenJwt";

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
  try {
    const rows = await db<User[]>`SELECT * FROM users WHERE email = ${email}`;

    return rows[0] || null;
  } catch (error) {
    return null;
  }
};

export const loginUser = async (
  user: Login
): Promise<ServiceResponse<Omit<User, "password">>> => {
  try {
    const userFound = await getUserByEmail(user.email);

    if (!userFound) {
      return { success: false, message: "Usuário ou senha incorretos" };
    }

    const isPassValid = await validatePassword(
      user.password,
      userFound.password
    );

    if (!isPassValid) {
      return { success: false, message: "Usuario ou senha incorretos" };
    }

    const { password: hash, ...userData } = userFound;

    const token = generateTokenJwt(userData.id);

    return { success: true, data: userData, token: token };
  } catch (error) {
    console.error("Erro ao logar usuário:", error);
    return { success: false, message: "Erro ao logar usuário", error };
  }
};
