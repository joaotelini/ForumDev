import db from "../database/connection";

import type { Comment } from "../schemas/commentsSchema";
import type { ServiceResponse } from "../types/serviceResponse";

export const createComment = async (
  comment: Comment
): Promise<ServiceResponse<Comment>> => {
  try {
    const result = await db`INSERT INTO comments ${db(comment)}`;

    if (result.affectedRows === 0) {
      return { success: false, message: "Erro ao criar comentário" };
    }

    return {
      success: true,
      data: comment,
    };
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    return { success: false, message: "Erro ao criar comentário", error };
  }
};

export const getCommentsByPostId = async (
  post_id: Comment["post_id"]
): Promise<ServiceResponse<Comment[]>> => {
  try {
    const rows = await db<Comment[]>`
      SELECT * FROM comments WHERE post_id = ${post_id} ORDER BY created_at ASC
    `;

    if (rows.length === 0) {
      return { success: false, message: "Nenhum comentário encontrado" };
    }

    return { success: true, data: rows };
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    return { success: false, message: "Erro ao buscar comentários", error };
  }
};
