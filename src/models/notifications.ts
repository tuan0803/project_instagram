import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import NotificationEntity from '@entities/notifications';
import NotificationInterface from '@interfaces/notifications';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class NotificationModel extends Model<NotificationInterface> implements NotificationInterface {
  public id: number;
  public userId: number;
  public deviceToken?: string;
  public notifiableType: string;
  public notifiableId: number;
  public title: string;
  public shortContent: string;
  public content: string;
  public readAt?: number;
  public data?: any;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly NOTIFIABLE_TYPE_ENUM = {
    SYSTEM: 'system',
  };

  static readonly hooks: Partial<ModelHooks<NotificationModel>> = {
    async beforeCreate (record) {
    },
    async afterCreate (record) {
    },
  }

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return {
        where: { id },
      };
    },
    byUser (userId) {
      return {
        where: { userId },
      };
    },
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    isUnRead () {
      return {
        where: { readAt: null },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(NotificationEntity, {
      hooks: NotificationModel.hooks,
      scopes: NotificationModel.scopes,
      tableName: 'notifications',
      sequelize,
    });
  }

  public static associate () {
  }
  public static async sendFollow(followerUser: any, followeeId: number, followerId: number) {
    return await NotificationModel.create({
      userId: followeeId,
      notifiableType: 'follow',
      notifiableId: followerId,
      title: 'Yêu cầu theo dõi mới',
      shortContent: `${followerUser.name} đã theo dõi bạn.`,
      content: `Người dùng ${followerUser.name} đã theo dõi bạn.`,
    });
  }
  
  public static async sendFollowRequest(followerUser: any, followeeId: number, followerId: number) {
    return await NotificationModel.create({
      userId: followeeId,
      notifiableType: 'follow_request',
      notifiableId: followerId,
      title: 'Yêu cầu theo dõi mới',
      shortContent: `${followerUser.name} đã gửi yêu cầu theo dõi bạn.`,
      content: `Người dùng ${followerUser.name} muốn theo dõi bạn.`,
    });
  }
  
  public static async sendFollowApprove(followerUser: any, followeeUser: any, followerId: number) {
    return await NotificationModel.create({
      userId: followerId,
      notifiableType: 'follow_approve',
      notifiableId: followerId,
      title: 'Yêu cầu theo dõi đã được phê duyệt',
      shortContent: `${followeeUser.name} đã chấp nhận yêu cầu theo dõi của bạn.`,
      content: `Người dùng ${followeeUser.name} đã chấp nhận yêu cầu theo dõi của bạn.`,
    });
  }
  
}

export default NotificationModel;
