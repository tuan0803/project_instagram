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
      await FollowerModel.checkExistingFollow(followerId, followeeId);
      const newFollow = await FollowerModel.create({
        followerId,
        followeeId,
        isApproved: !targetUser.isPrivate,
      });
      
        return sendSuccess(res, { item: newFollow });

    } catch (error) {
      sendError(res, 500, {errorCode : 131}, error);
    }
  }
}

export default new FollowerController();