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
  public async getFollowers (req: Request, res: Response) {
    try {
      const userId = req.currentUser['x-user-id'];

      const followers = await FollowerModel.scope([
        { method : ['byFollowee', userId] },
        { method : ['scope', ['isApproved', true]] }
      ]).findAll({
        include : [{model: UserModel, as : 'followerInfo', attributes : ['id', 'name', 'avatar_url'] }],
      });
      return sendSuccess(res, { items : followers });
    } catch (error) {
      sendError(res, 500, {errorCode : 133}, error);
    }
  }
  public async getFollowing (req: Request, res: Response) {
    try {
      const userId = req.currentUser['x-user-id'];

      const following = await FollowerModel.scope([
        { method : ['byFollower', userId] },
        { method : ['scope', ['isApproved', true]] }
      ]).findAll({
        include : [{model: UserModel, as : 'followingInfo', attributes : ['id', 'name', 'avatar_url'] }],
      });
      return sendSuccess(res, {items : following});
    } catch (error) {
      sendError(res, 500, {errorCode : 134}, error);
    }
  }
  public async removeFollower(req: Request, res: Response){
    try {
      const userId = req.currentUser['x-user-id'];
      const {followerId} = req.body;

      const followRecord = await FollowerModel.findOne({
        where: { followeeId: userId, followerId }
      });
      if (!followRecord){
          return sendError(res, 404, NoData.message);
        }
        await followRecord.destroy();
        return sendSuccess(res, { message : 'removed' });
    } catch (error) {
      sendError(res, 500,{errorCode: 134}, error);
    }
  }
}

export default new FollowerController();