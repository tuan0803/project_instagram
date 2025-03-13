import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import CommentModel from '@models/comment';
import { Op } from 'sequelize';

class CommentController {
  public async addComment(req: Request, res: Response) {
    try {
      const { postId, content, parentId } = req.body;
      const userId = req.currentUser.id;

      if (!postId || !content.trim()) {
        return sendError(res, 400, 'Post ID and content are required');
      }

      const comment = await CommentModel.create({ postId, userId, content, parentId });
      return sendSuccess(res, { comment }, 'Comment added successfully');
    } catch (error) {
      return sendError(res, 500, { errorCode: 200 }, error);
    }
  }

  public async getNestedComments(postId: number, parentId: number | null = null): Promise<any> {
    const comments = await CommentModel.findAll({
      where: { postId, parentId },
      order: [['createdAt', 'ASC']],
      raw: true,
    });

    return Promise.all(
      comments.map(async (comment) => ({
        ...comment,
        replies: await this.getNestedComments(postId, comment.id),
      }))
    );
  }

  public getComments = async (req: Request, res: Response) => {
    try {
      const { postId } = req.query;
      if (!postId) {
        return sendError(res, 400, 'Post ID is required');
      }
  
      const comments = await this.getNestedComments(Number(postId));
  
      return sendSuccess(res, { data: comments });
    } catch (error) {
      return sendError(res, 500, { errorCode: 201 }, error);
    }
  };
  

  public async deleteComment(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      const userId = req.currentUser.id;

      const comment = await CommentModel.findOne({ where: { id: commentId, userId } });
      if (!comment) {
        return sendError(res, 404, 'Comment not found or unauthorized');
      }

      await comment.destroy();
      return sendSuccess(res, {}, 'Comment deleted successfully');
    } catch (error) {
      return sendError(res, 500, { errorCode: 202 }, error);
    }
  }
}

export default new CommentController();
