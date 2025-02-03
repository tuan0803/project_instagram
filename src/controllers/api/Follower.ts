import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import { NoData } from '@libs/errors';
import FollowerModel from '@models/followers';
import UserModel from '@models/users';
class FollowerController {
  public async follow (req: Request, res: Response) {
    try {
      const { followeeId } = req.body;

      const followerId = req.currentUser['x-user-id'];

      const targetUser = await UserModel.findByPk(followeeId);

      if (!targetUser) {
        return sendError(res, 404, NoData.message);
      }
      await FollowerModel.validateFollowRequest(followerId, followeeId);
      const newFollow = await FollowerModel.create({
        followerId,
        followeeId,
        isApproved: false,
      });
      if (!targetUser.isPrivate) {
        await newFollow.update({ isApproved: true });
        return sendSuccess(res, { item: newFollow }, 'Bắt đầu theo dõi người dùng này.');
      }
      return sendSuccess(res, {item: newFollow}, 'Tài khoản Private, cần đợi xác nhận');
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new FollowerController();