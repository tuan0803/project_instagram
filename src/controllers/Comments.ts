import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import CommentModel from '@models/comments';
import CommentInterface from '@interfaces/comments';

class CommentController {
  public async getComments(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const { page = 1, limit = 15 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const comments = await CommentModel.findAll({
        where: { postId },
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset: offset,
      });

      return sendSuccess(res, comments, 'Lấy danh sách bình luận thành công');
    } catch (error) {
      return sendError(res, 500, 'Lỗi khi lấy danh sách bình luận', error.message || error);
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const { postId, userId, parentId } = req.params;
      const { content } = req.body;
      const newComment = await CommentModel.create({
        postId: Number(postId),
        userId: Number(userId),
        content,
        parentId: parentId ? Number(parentId) : null,
      } as CommentInterface);

      return sendSuccess(res, newComment, 'Tạo bình luận thành công');
    } catch (error) {
      return sendError(res, 500, 'Lỗi khi tạo bình luận', error.message || error);
    }
  }
}

export default new CommentController();
