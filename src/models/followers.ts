import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import FollowerEntity from '@entities/followers';
import FollowerInterface from '@interfaces/followers';
import NotificationModel from '@models/notifications';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import UserModel from '@models/users';
class FollowerModel extends Model<FollowerInterface> implements FollowerInterface {
  public id: number;
  public followerId: number;
  public followeeId: number;
  public isApproved: boolean;
  public createdAt?: Date;

  static readonly scopes: ModelScopeOptions = {
    byId(id) {
      return { where: { id } };
    },
    byFollower(followerId) {
      return { where: { followerId } };
    },
    byFollowee(followeeId) {
      return { where: { followeeId } };
    },
    isApproved() {
      return { where: { isApproved: true } };
    },
    byFollowerAndFollowee(followerId: number, followeeId: number) {
      return { where: { followerId, followeeId } };
    },
  };

  static readonly hooks: Partial<ModelHooks<FollowerModel>> = {
    async beforeCreate(follower) {

    },
    async afterCreate(follower) {
      const followerUser = await UserModel.findByPk(follower.followerId);

      await NotificationModel.create({
        userId: follower.followerId,
        notifiableType: 'follow_request',
        notifiableId: follower.id,
        title: 'Yêu cầu theo dõi mới',
        shortContent: `${followerUser.name} đã gửi yêu cầu theo dõi bạn.`,
        content: `Người dùng ${followerUser.name} muốn theo dõi bạn.`,
      });
    },
  };

  public static initialize(sequelize: Sequelize) {
    this.init(FollowerEntity, {
      hooks: FollowerModel.hooks,
      scopes: FollowerModel.scopes,
      sequelize,
      tableName: 'followers',
    });
  }

  public static associate() {

  }

  public static async validateFollowRequest(followerId: number, followeeId: number) {
    const existingFollower = await FollowerModel.scope([
      { method: ['byFollowerAndFollowee', followerId, followeeId] },
    ]).findOne();

    if (existingFollower) {
      throw new Error('Bạn đã theo dõi người này');
    }
  }
}

export default FollowerModel;