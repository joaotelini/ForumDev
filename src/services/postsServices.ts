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
    const rows = await db<Post[]>`
    SELECT 
      p.id AS post_id,
      p.title AS post_title,
      p.content AS post_content,
      p.created_at AS post_created_at,
      u.id AS user_id,
      u.username AS user_username,
      COUNT(c.id) AS comment_count
    FROM posts p
    INNER JOIN users u ON p.user_id = u.id
    LEFT JOIN comments c ON c.post_id = p.id
    GROUP BY p.id, u.id
    ORDER BY p.created_at DESC;`;

    if (rows.length === 0) {
      return { success: false, message: "Nenhum post encontrado" };
    }

    return { success: true, data: rows };
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return { success: false, message: "Erro ao buscar posts", error };
  }
};

export const getPostsByUserId = async (
  user_id: Post["user_id"]
): Promise<ServiceResponse<Post[]>> => {
  try {
    const rows = await db<Post[]>`
SELECT 
  p.id AS post_id,
  p.title AS post_title,
  p.content AS post_content,
  p.created_at AS post_created_at,
  u.id AS user_id,
  u.username AS user_username,
  COUNT(c.id) AS comment_count
FROM posts p
INNER JOIN users u ON p.user_id = u.id
LEFT JOIN comments c ON c.post_id = p.id
WHERE u.id = ${user_id}
GROUP BY p.id, p.title, p.content, p.created_at, u.id, u.username
ORDER BY p.created_at DESC;


    `;

    if (rows.length === 0) {
      return {
        success: true,
        message: "Nenhum post encontrado por esse usuário",
      };
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
    const rows = await db<Post[]>`
    SELECT 
      p.id AS post_id, 
      p.title AS post_title, 
      p.content AS post_content,
      p.created_at AS post_created_at, 
      u.id AS user_id, 
      u.username AS user_username
    FROM posts p 
    INNER JOIN users u
    ON u.id = p.user_id 
    WHERE p.id = ${id} 
    GROUP BY p.id, u.id
    ORDER BY p.created_at DESC;`;

    if (rows.length === 0) {
      return { success: false, message: "Post não encontrado" };
    }

    return { success: true, data: rows[0] };
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    return { success: false, message: "Erro ao buscar post", error };
  }
};

export const createPost = async (
  post: Post
): Promise<ServiceResponse<Post>> => {
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
