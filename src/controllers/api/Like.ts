import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import LikeModel from '@models/likes';
import UserModel from '@models/users';

class LikeController {
  public async get(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const likes = await LikeModel.findAll({
        where: { postId },
        include: [{ model: UserModel, as: 'user', attributes: ['id', 'username', 'avatar_url'] }],
      });

      return sendSuccess(res, likes, 'Lấy danh sách người đã like thành công');
    } catch (error: any) {
      return sendError(res, 500, 'Lỗi khi lấy danh sách like', error.message || error);
    }
  }

  public async toggleLike(req: Request, res: Response) {
    try {
      const userId = req.currentUser?.userId ?? 1;
      const { postId } = req.params;
      const existingLike = await LikeModel.findOne({ where: { postId, userId } });
      
      if (existingLike) {
        await existingLike.destroy();
        return sendSuccess(res, null, 'Bỏ like thành công');
      } else {
        await LikeModel.create({ postId, userId });
        return sendSuccess(res, null, 'Like thành công');
      }
    } catch (error: any) {
      return sendError(res, 500, 'Lỗi khi thực hiện like/unlike', error.message || error);
    }
  }
}

export default new LikeController();
