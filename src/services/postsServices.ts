import db from "../database/connection";
import type { Post } from "../schemas/postsSchema";
import type { ServiceResponse } from "../types/serviceResponse";

export const deletePost = async (
  id: Post["id"]
): Promise<ServiceResponse<null>> => {
  try {
    // DELETE do Bun nao retorna o numero de linhas afetadas
    // Verifica se o post existe antes de deletar
    const exists = await db`SELECT id FROM posts WHERE id = ${id}`;

    if (exists.length === 0) {
      return { success: false, message: "Post não encontrado" };
    }

    await db`DELETE FROM posts WHERE id = ${id}`;

    return { success: true, message: "Post deletado com sucesso" };
  } catch (error) {
    console.error("Erro ao deletar post:", error);
    return { success: false, message: "Erro ao deletar post", error };
  }
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

export const getPostByUserId = async (
  user_id: Post["user_id"]
): Promise<ServiceResponse<Post[]>> => {
  try {
    const rows = await db<Post[]>`
      SELECT title, content FROM posts WHERE user_id = ${user_id}
    `;

    if (rows.length === 0) {
      return {
        success: false,
        message: "Nenhum post encontrado por esse usuário",
      };
    }

    const data = rows.filter((row: any) => row.title && row.content);

    return { success: true, data: data };
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
    };
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return { success: false, message: "Erro ao criar post", error };
  }
};
