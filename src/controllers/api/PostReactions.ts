import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import PostReactionModel from '@models/postReactions';
import UserModel from '@models/users';

class PostReactionController {
  public async getall(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      console.log(req.params);
      console.log(req.params);
      console.log(req.params);
      console.log(req.params);
      console.log(req.params);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await PostReactionModel.findAndCountAll({
        where: { postId },
        include: [
          { model: UserModel, as: 'user', attributes: ['id', 'name', 'avatar_url'] },
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });
      return sendSuccess(res, {
        likes: rows,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(count / Number(limit)),
          total: count
        },
      },
        'Lấy danh sách người đã thích thành công'
      );
    } catch (error: any) {
      return sendError(res, 500, 'Lỗi khi lấy danh sách like', error.message || error);
    }
  }

  public async toggleLike(req: Request, res: Response) {
    try {
      const userId = req.currentUser?.userId ?? 1;
      const { postId } = req.params;
      const existingLike = await PostReactionModel.findOne({ where: { postId, userId } });

      if (existingLike) {
        await existingLike.destroy();
        return sendSuccess(res, null, 'Bỏ like thành công');
      } else {
        await PostReactionModel.create({ postId, userId });
        return sendSuccess(res, null, 'Like thành công');
      }
    } catch (error: any) {
      return sendError(res, 500, 'Lỗi khi thực hiện like/unlike', error.message || error);
    }
  }
}

export default new PostReactionController();
