import { Model, Sequelize, ModelScopeOptions } from 'sequelize';
import PostEntity from '@entities/posts';
import PostInterface, { PostCreationAttributes } from '@interfaces/posts';
import { ModelHooks } from 'sequelize/types/lib/hooks';
// import MediaModel from './medias';
// import ReactionsModel from './reactions';
// import CommentModel from './comments';
// import HastagModel from './hashtags';

class PostModel extends Model<PostInterface, PostCreationAttributes> implements PostInterface {
  public id: number;
  public userId: number;
  public text: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public commentCount: number;
  public reactionCount: number;

  static readonly NOTIFIABLE_TYPE_ENUM = {
    SYSTEM: 'system',
  };

  static readonly hooks: Partial<ModelHooks<PostModel>> = {
    async beforeCreate (record) {
      record.commentCount = record.commentCount || 0;
      record.reactionCount = record.reactionCount || 0;
    },
    async afterCreate (record) {
      console.log('Done post:', record);
    },
  };

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return {
        where: { id },
      };
    },
  };

  public static initialize (sequelize: Sequelize) {
    this.init(PostEntity, {
      hooks: PostModel.hooks,
      tableName: 'posts',
      sequelize,
      timestamps: true,
    });
  }

  public static associate () {
  }
}

export default PostModel;
