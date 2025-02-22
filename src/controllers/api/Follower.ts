import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import { NoData } from '@libs/errors';
import FollowerModel from '@models/followers';
import UserModel from '@models/users';
class FollowerController {
  public async follow (req: Request, res: Response) {
    try {
      const { followeeId } = req.body;

      const followerId = req.currentUser.id;

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
      const followerId = req.currentUser.id;

      const follow = await FollowerModel.scope([
        { method: ['byFollowerAndFollowee', followerId, followeeId] },
      ]).findOne();
      if(!follow){
        return sendError(res, 404, NoData.message);
      }
      await follow.destroy();
        return sendSuccess(res, { isSuccess: true });
    } catch (error) {
      sendError(res, 500, {errorCode : 132}, error);
    }
  }
  public async getFollowers(req: Request, res: Response) {
    
    try {
      const followeeId = req.query.followeeId ? Number(req.query.followeeId) : req.currentUser.id;
      const currentUserId = req.currentUser.id;
      const targetUser = await UserModel.findByPk(followeeId);
      if (!targetUser) {
        return sendError(res, 404, NoData.message);
      }
      if (targetUser.isPrivate && targetUser.id !== currentUserId) {
        const isFollowing = await FollowerModel.findOne({
          where:{ followerId: currentUserId, followeeId: followeeId, isApproved : true },
        });
        if(!isFollowing){
          return sendError(res, 405, NoData.message);
        }
      }
      const {limit = 10, page =1} = req.query;
      const pageNumber = Number(page);
      const limitNumber = Number(limit);
      const offset = (pageNumber - 1) * limitNumber;
      const { rows: followers, count: totalFollowers } = await FollowerModel.scope([
        { method: ['byFollowee', followeeId] },
        { method: ['isApproved'] },
      ]).findAndCountAll({
        include: [{ model: UserModel, as: 'followerInfo', attributes: ['id', 'name', 'avatar_url'] }],
        limit: limitNumber,
        offset: offset,
      });
      const totalPages = Math.ceil(totalFollowers / limitNumber);
      return sendSuccess(res, {
        followers,
        pagination: {
          totalFollowers,
          totalPages,
          currentPage: pageNumber,
          limit: limitNumber,
        },
      });
    } catch (error) {
      sendError(res, 500, { errorCode: 132 }, error);
    }
  }
  public async getFollowing(req: Request, res: Response) {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : req.currentUser.id;
      const currentUserId = req.currentUser.id;

      const targetUser = await UserModel.findByPk(userId);
      if (!targetUser) {
        return sendError(res, 404, NoData.message);
      }
  
      if (targetUser.isPrivate && targetUser.id !== currentUserId) {

        const isFollowing = await FollowerModel.findOne({
          where: { followerId: currentUserId, followeeId: userId, isApproved: true },
        });
        if (!isFollowing) {
          return sendError(res, 405, NoData.message); 
        }
      }
  
      const { limit = 10, page = 1 } = req.query;
      const pageNumber = Number(page);
      const limitNumber = Number(limit);
      const offset = (pageNumber - 1) * limitNumber;
      const { rows: following, count: totalFollowing } = await FollowerModel.findAndCountAll({
        where: { followerId: userId, isApproved: true },
        include: [{ model: UserModel, as: 'followeeInfo', attributes: ['id', 'name', 'avatar_url'] }],
        limit: limitNumber,
        offset: offset,
      });
  
      const totalPages = Math.ceil(totalFollowing / limitNumber);
      return sendSuccess(res, {
        following,
        pagination: {
          totalFollowing,
          totalPages,
          currentPage: pageNumber,
          limit: limitNumber,
        },
      });
    } catch (error) {
      sendError(res, 500, { errorCode: 133 }, error);
    }
  }
  public async removeFollower(req: Request, res: Response) {
    try {
      const currentUserId = req.currentUser.id;
      const { followerId } = req.body;
      const follower = await UserModel.findByPk(followerId);
      if (!follower) {
        return sendError(res, 404, NoData.message);
      }

      const followRecord = await FollowerModel.findOne({
        where: { followeeId: currentUserId, followerId: followerId },
      });

      if (!followRecord) {
        return sendError(res, 404, NoData.message);
      }
      await followRecord.destroy();  
      return sendSuccess(res, { isSuccess: true });
    } catch (error) {
      sendError(res, 500, { errorCode: 134 }, error);
    }
  }
}

export default new FollowerController();