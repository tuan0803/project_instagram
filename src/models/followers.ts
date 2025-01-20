import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import FollowerEntity from '@entities/followers';
import FollowerInterface from '@interfaces/followers';
import NotificationModel from '@models/notifications';
// import { ModelHooks } from 'sequelize/types/lib/hooks';

class FollowerModel extends Model<FollowerInterface> implements FollowerInterface {
  public id: number;
  public followerId: number;
  public followeeId: number;
  public isApproved: boolean;
  public createdAt?: Date;

  // static readonly hooks: Partial<ModelHooks<FollowerModel>>
  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return {
        where: { id },
      };
    },
    byFollower (followerId) {
      return {
        where: { followerId },
      };
    },
    byFollowee (followeeId) {
      return {
        where: { followeeId },
      };
    },
    isApproved () {
      return {
        where: { isApproved: true },
      };
    },
    byFollowerAndFollowee (followerId: number, followeeId: number) {
      return {
        where: {
          followerId,
          followeeId,
        },
      };
    },
  };

  public static initialize (sequelize: Sequelize) {
    this.init(FollowerEntity, {
      hooks: {
        async beforeCreate (follower) {
          const existingFollower = await FollowerModel.scope([
            { method: ['byFollowerAndFollowee', follower.followerId, follower.followeeId] },
          ]).findOne();
          if (existingFollower) {
            throw new Error('Bạn đã theo dõi người này');
          }
        },
        async afterCreate (follower) {
          const mockUser = {
            name: 'Test User',
          };
          await NotificationModel.create({
            userId: follower.followerId,
            notifiableType: 'follow_request',
            notifiableId: follower.id,
            title: 'Yêu cầu theo dõi mới',
            shortContent: `${mockUser.name} đã gửi yêu cầu theo dõi bạn.`,
            content: `Người dùng ${mockUser.name} muốn theo dõi bạn.`,
          });
        },
      },

      scopes: FollowerModel.scopes,
      tableName: 'followers',
      sequelize,
    });
  }

  public static associate () {

  }
}

export default FollowerModel;
