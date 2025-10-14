import db from "../database/connection";
import type { Post } from "../schemas/postsSchema";

type ServiceResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
};

export const getPosts = async (): Promise<ServiceResponse<Post[]>> => {
  try {
    const rows = await db<Post[]>`SELECT * FROM posts`;

    if (rows.length === 0) {
      return { success: false, message: "Nenhum post encontrado" };
    }

    return { success: true, data: rows };
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return { success: false, message: "Erro ao buscar posts", error };
  }
};

export const getPostById = async (
  id: Post["id"]
): Promise<ServiceResponse<Post>> => {
  try {
    const rows = await db<Post[]>`SELECT * FROM posts WHERE id = ${id}`;

    if (rows.length === 0) {
      return { success: false, message: "Post não encontrado" };
    }

    return { success: true, data: rows[0] };
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    return { success: false, message: "Erro ao buscar post", error };
  }
};

export const makePost = async (post: Post): Promise<ServiceResponse<Post>> => {
  try {
    const result = await db`INSERT INTO posts ${db(post)}`;

    if (result.affectedRows === 0) {
      return { success: false, message: "Erro ao criar post" };
    }

    return {
      success: true,
      data: post,
      message: "Post criado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return { success: false, message: "Erro ao criar post", error };
  }
};
