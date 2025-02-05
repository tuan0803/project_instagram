import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationError, ValidationErrorItem } from 'sequelize';
import FollowerEntity from '@entities/followers';
import FollowerInterface from '@interfaces/followers';
import NotificationModel from '@models/notifications';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import UserModel from '@models/users';
import { InvalidOtp, Forbidden, AccountIsNotVerified} from '@libs/errors';
class FollowerModel extends Model<FollowerInterface> implements FollowerInterface {
  public id: number;
  public followerId: number;
  public followeeId: number;
  public isApproved: boolean;
  public createdAt?: Date;

  static readonly CREATABLE_PARAMETERS = ['followerId', 'followeeId', 'isApproved'];
  static readonly UPDATABLE_PARAMETERS = ['isApproved'];

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
    async afterCreate(follower: FollowerModel) {
      const followerUser = await UserModel.findByPk(follower.followerId);
      if (!follower.isApproved) {
        await NotificationModel.sendFollowRequest(followerUser, follower.followeeId, follower.id);
      } else {
        await NotificationModel.sendFollow(followerUser, follower.followeeId, follower.id);
      }
    },

    async afterUpdate(follower: FollowerModel) {
      if (follower.changed('isApproved') && follower.isApproved) {
        const [followerUser, followeeUser] = await Promise.all([
          UserModel.findByPk(follower.followerId),
          UserModel.findByPk(follower.followeeId),
        ]);
        if (followerUser && followeeUser) {
          await NotificationModel.sendFollowApprove(followerUser, followeeUser, follower.id);
        }
      }
    },
  };

  static readonly validations: ModelValidateOptions = {
    async isFollowerExist() {
      const user = await UserModel.findByPk(this.followerId);
      if (!user) {
        throw new ValidationError('Validation Error', [
          new ValidationErrorItem('Follower không tồn tại!', 'Validation error', 'followerId', this.followerId)
        ]);
      }
    },
    async isFolloweeExist() {
      const user = await UserModel.findByPk(this.followeeId);
      if (!user) {
        throw new ValidationError('Validation Error', [
          new ValidationErrorItem('Followee không tồn tại!', 'Validation error', 'followeeId', this.followeeId)
        ]);
      }
    },
  };
  public static async checkExistingFollow(followerId: number, followeeId: number) {
    const existingFollow = await FollowerModel.scope([
      { method: ['byFollowerAndFollowee', followerId, followeeId] },
    ]).findOne();

    if (existingFollow) {
      if (existingFollow.isApproved) {
        throw new ValidationError('Validation Error', [
          new ValidationErrorItem('Đã tồn tại mối quan hệ follow!', 'Validation error', 'followeeId', String(followeeId))
        ]);
      } else {
        throw new ValidationError('Validation Error', [
          new ValidationErrorItem('Yêu cầu follow đang chờ phê duyệt!', 'Validation error', 'followeeId', String(followeeId))
        ]);
      }
    }
  }

  private static async checkUserExist(userId: number, errorType: any) {
    const user = await UserModel.findByPk(userId);
    if (!user) {
      throw new ValidationError('Validation Error', [
        new ValidationErrorItem(`Người dùng với ID ${userId} không tồn tại!`, 'Validation Error', 'userId', String(userId))
      ]);
    }
  }
  public static initialize(sequelize: Sequelize) {
    this.init(FollowerEntity, {
      hooks: FollowerModel.hooks,
      scopes: FollowerModel.scopes,
      validate: FollowerModel.validations,
      sequelize,
      tableName: 'followers',
      modelName: 'follower',
      timestamps: true,
      createdAt: 'created_at',
    });
  }

  public static associate() {

  }

  }

export default FollowerModel;