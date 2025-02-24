import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import CommentReactionModel from '@models/commentReactions';
import UserModel from '@models/users';

class CommentReactionController {
  public async get(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      const likes = await CommentReactionModel.findAndCountAll({
        where: { commentId },
        include: [{ model: UserModel, as: 'user', attributes: ['id', 'name', 'avatar_url'] }],
      });

      return sendSuccess(res, likes, 'Lấy danh sách người đã like thành công');
    } catch (error: any) {
      return sendError(res, 500, 'Lỗi khi lấy danh sách like', error.message || error);
    }
  }

  public async toggleLike(req: Request, res: Response) {
    try {
      const userId = req.currentUser?.userId ?? 1;
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
      return sendError(res, 500, 'Lỗi khi thực hiện like/unlike', error.message || error);
    }
  }
}

export default new CommentReactionController();
