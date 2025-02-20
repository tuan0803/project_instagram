import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import PostEntity from '@entities/posts';
import PostInterface from '@interfaces/posts';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import LikeModel from './likes';

class PostModel extends Model<PostInterface> implements PostInterface {
  public id: number;
  public userId: number;
  public text?: string;
  public createdAt: Date;
  public updatedAt: Date;
  public commentCount?: number;
  public reactionCount?: number;

  static readonly NOTIFIABLE_TYPE_ENUM = {
    SYSTEM: 'system',
  };

  static readonly hooks: Partial<ModelHooks<PostModel>> = {
    async beforeCreate (record) {},
    async afterCreate (record) {},
  };

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
  };

  public static initialize (sequelize: Sequelize) {
    this.init(PostEntity, {
      hooks: PostModel.hooks,
      scopes: PostModel.scopes,
      tableName: 'posts',
      sequelize,
    });
  }

  public static associate () {
  }
}

export default PostModel;
