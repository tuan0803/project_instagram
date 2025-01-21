import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
// import { NoData } from '@libs/errors';
import FollowerModel from '@models/followers';
import UserModel from '@models/users';
class FollowerController {
  public async follow (req: Request, res: Response) {
    try {
      const { followeeId } = req.body;
      const targetUser = await UserModel.findByPk(followeeId);

      if (!targetUser) {
        return sendError(res, 404, 'Người dùng không tồn tại.');
      }
      if (targetUser.isPrivate){
        return sendSuccess (res, {}, 'Tài khoản Private, cần đợi xác nhận')
      }
      // User ảo
      const mockUser = {
        'x-user-id': 1,
        name: 'Test User',
      };
      const followerId = mockUser['x-user-id'];

      const newFollow = await FollowerModel.create({
        followerId,
        followeeId,
        isApproved: true,
      });

      sendSuccess(res, { item: newFollow }, 'Bắt đầu theo dõi người dùng này.');
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new FollowerController();
