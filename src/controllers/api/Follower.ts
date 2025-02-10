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
      await FollowerModel.build({
        followerId: Number(followerId),
        followeeId: Number(followeeId),
        isApproved: false,
      }).validate();
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
  public async unfollow (req: Request, res: Response) {
    try {
      const {followeeId} = req.body;
      const followerId = req.currentUser['x-user-id'];

      const follow = await FollowerModel.scope([
        { method: ['byFollowerAndFollowee', followerId, followeeId] },
      ]).findOne();
      if(!follow){
        return sendError(res, 404, NoData.message);
      }
      await follow.destroy();
        return sendSuccess(res, { message : 'unfollowed' });
    } catch (error) {
      sendError(res, 500, {errorCode : 132}, error);
    }
  }
  public async getFollowers (req: Request, res: Response) {}
  public async getFollowing (req: Request, res: Response) {}
}

export default new FollowerController();