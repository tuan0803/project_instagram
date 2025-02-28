import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import CommentReactionModel from '@models/commentReactions';
import UserModel from '@models/users';

class CommentReactionController {
  public async get(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      const { page = 1, limit = 16 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);
      const { count, rows } = await CommentReactionModel.findAndCountAll({
        where: { commentId },
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset,
        include: [{ model: UserModel, as: 'user', attributes: ['id', 'name', 'avatar_url'] }],
      });
      return sendSuccess(res, {
        likes: rows,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(count / Number(limit)),
          total: count
        },
      }, 'Lấy danh sách người đã thích thành công');
    } catch (error: any) {
      return sendError(res, 500, 'Lỗi khi lấy danh sách thích', error.message || error);
    }
  }

  public async toggleLike(req: Request, res: Response) {
    try {
      const userId = req.currentUser?.id;
      const { commentId } = req.params;
      const existingLike = await CommentReactionModel.findOne({ where: { commentId, userId } });
      if (existingLike) {
        await existingLike.destroy();
        return sendSuccess(res, null, 'Bỏ like thành công');
      } else {
        await CommentReactionModel.create({ commentId, userId });
        return sendSuccess(res, null, 'Like thành công');
      }
    } catch (error: any) {
      return sendError(res, 500, 'Lỗi khi thực hiện thích/không thích', error.message || error);
    }
  }
}

export default new CommentReactionController();
