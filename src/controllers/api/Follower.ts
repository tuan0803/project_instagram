import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import { NoData } from '@libs/errors';
import FollowerModel from '@models/followers';
import NotificationModel from '@models/notifications';

class FollowerController {
  public async follow (req: Request, res: Response) {
    try {
      const { followeeId } = req.body;
      console.log(followeeId);
      const followeeIdNumber = Number(followeeId);
      console.log('Followee số:', followeeIdNumber);
      if (!followeeId) {
        return sendError(res, 400, 'Thiếu followeeId.');
      }
      if (!followeeId || isNaN(followeeIdNumber)) {
        return sendError(res, 400, 'Phải là số.');
      }
      // User ảo
      const mockUser = {
        'x-user-id': 1,
        name: 'Test User',
      };
      const followerId = mockUser['x-user-id'];
      console.log(followeeId);

      const existingFollower = await FollowerModel.scope([
        { method: ['byFollowerAndFollowee', followerId, followeeId] },
      ]).findOne();

      if (existingFollower) return sendError(res, 400, 'Bạn đã theo dõi người này.');

      const newFollow = await FollowerModel.create({
        followerId,
        followeeId,
        isApproved: false,
      });

      await NotificationModel.create({
        userId: followeeId,
        notifiableType: 'follow_request',
        notifiableId: newFollow.id,
        title: 'Yêu cầu theo dõi mới',
        shortContent: `${mockUser.name} đã gửi yêu cầu theo dõi bạn.`,
        content: `Người dùng ${mockUser.name} muốn theo dõi bạn.`,
      });

      sendSuccess(res, { item: newFollow }, 'Yêu cầu theo dõi đã được gửi.');
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async approveFollow (req: Request, res: Response) {
    try {
      const { followId } = req.params;
      const mockUser = {
        'x-user-id': 1,
        name: 'Test User',
      };
      const followRequest = await FollowerModel.scope([
        { method: ['byId', followId] },
      ]).findOne();

      if (!followRequest || followRequest.followeeId !== mockUser['x-user-id']) { // req.currentUser
        return sendError(res, 404, NoData);
      }

      await followRequest.update({ isApproved: true });

      sendSuccess(res, { item: followRequest }, 'Yêu cầu theo dõi đã được chấp nhận.');
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async unfollow (req: Request, res: Response) {
    try {
      const { followeeId } = req.params;
      // User ao
      const mockUser = {
        'x-user-id': 1,
        name: 'Test User',
      };
      const followerId = mockUser['x-user-id'];
      // const followerId = req.currentUser['x-user-id'];

      const followRecord = await FollowerModel.scope([
        { method: ['byFollowerAndFollowee', followerId, followeeId] },
      ]).findOne();

      if (!followRecord) return sendError(res, 404, NoData);

      await followRecord.destroy();

      sendSuccess(res, {}, 'Hủy theo dõi thành công.');
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async followersList (req: Request, res: Response) {
    try {
      // const userId = req.currentUser['x-user-id'];
      const mockUser = {
        'x-user-id': 1,
        name: 'Test User',
      };

      const userId = mockUser['x-user-id'];
      const followers = await FollowerModel.scope([
        { method: ['byFollowee', userId] },
        'isApproved',
      ]).findAll();

      sendSuccess(res, { items: followers }, 'Danh sách người theo dõi.');
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async followingList (req: Request, res: Response) {
    try {
      // const userId = req.currentUser['x-user-id'];
      const mockUser = {
        'x-user-id': 1,
        name: 'Test User',
      };

      const userId = mockUser['x-user-id'];
      const followings = await FollowerModel.scope([
        { method: ['byFollower', userId] },
        'isApproved',
      ]).findAll();

      sendSuccess(res, { items: followings }, 'Danh sách đang theo dõi.');
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new FollowerController();
