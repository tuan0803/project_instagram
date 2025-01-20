import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
// import { NoData } from '@libs/errors';
import FollowerModel from '@models/followers';

class FollowerController {
  public async follow (req: Request, res: Response) {
    try {
      const { followeeId } = req.body;
      // const targetUser = await UserModel.findByPk(followeeId);// Chưa có UserModel

      // if (!targetUser) {
      //   return sendError(res, 404, 'Người dùng không tồn tại.');
      // }
      // User ảo
      const mockUser = {
        'x-user-id': 1,
        name: 'Test User',
      };
      const followerId = mockUser['x-user-id'];

      const newFollow = await FollowerModel.create({
        followerId,
        followeeId,
        isApproved: false,
      });

      sendSuccess(res, { item: newFollow }, 'Yêu cầu theo dõi đã được gửi.');
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new FollowerController();
