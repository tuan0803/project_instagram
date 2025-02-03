import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
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
    if(!follower.isApproved){
      await NotificationModel.create({
        userId: follower.followeeId,
        notifiableType: 'follow_request',
        notifiableId: follower.id,
        title: 'Yêu cầu theo dõi mới',
        shortContent: `${followerUser.name} đã gửi yêu cầu theo dõi bạn.`,
        content: `Người dùng ${followerUser.name} muốn theo dõi bạn.`,
      });
    } else {
      await NotificationModel.create({
        userId: follower.followeeId,
        notifiableType: 'follow',
        notifiableId: follower.id,
        title: 'Yêu cầu theo dõi mới',
        shortContent: `${followerUser.name} đã theo dõi bạn.`,
        content: `Người dùng ${followerUser.name} đã theo dõi bạn.`,
      });
    }
    },
    async afterUpdate(follower) {
      if (follower.changed('isApproved') && follower.isApproved) {
        const [followerUser, followeeUser] = await Promise.all([
          UserModel.findByPk(follower.followerId),
          UserModel.findByPk(follower.followeeId),
        ]);
        if (!followerUser || !followeeUser) return;

        await NotificationModel.create({
          userId: follower.followerId,
          notifiableType: 'follow_approve',
          notifiableId: follower.id,
          title: 'Yêu cầu theo dõi đã được phê duyệt',
          shortContent: `${followeeUser.name} đã chấp nhận yêu cầu theo dõi của bạn.`,
          content: `Người dùng ${followeeUser.name} đã chấp nhận yêu cầu theo dõi của bạn.`,
        });
      }
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
    
      const [followerUser, followeeUser] = await Promise.all([
        UserModel.findByPk(followerId),
        UserModel.findByPk(followeeId),
      ]);
  
      if (!followerUser) {
        const error: any = new Error();
        error.errorCode = Forbidden.errorCode; 
        throw error;
      }
  
      if (!followeeUser) {
        const error: any = new Error();
        error.errorCode = AccountIsNotVerified.errorCode;
        throw error;
      }
  
      const existingFollower = await FollowerModel.scope([
        { method: ['byFollowerAndFollowee', followerId, followeeId] },
      ]).findOne();
  
      if (existingFollower) {
        const error: any = new Error();
        if (existingFollower.isApproved) {
          error.errorCode = InvalidOtp.errorCode;
        } else {
          error.errorCode = AccountIsNotVerified.errorCode;
        }
        throw error;
      }
    
    }
  }

export default FollowerModel;