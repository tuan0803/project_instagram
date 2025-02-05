import { Model, Sequelize, ModelScopeOptions } from 'sequelize';
import PostEntity from '@entities/posts';
import PostInterface from '@interfaces/posts';
import MediaModel from '@models/medias';
import HashtagModel from '@models/hashtags';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class PostModel extends Model<PostInterface> implements PostInterface {
  public id: number;
  public userId: number;
  public text?: string;
  public createdAt: Date;
  public updatedAt: Date;

  static readonly CREATABLE = ['userId', 'text'];

  static readonly hooks: Partial<ModelHooks<PostModel>> = {
    async beforeCreate (record) {
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
      sequelize,
      tableName: 'posts',
      timestamps: false,
    });
  }

  public static associate() {
    PostModel.hasMany(MediaModel, {
      foreignKey: 'postId',
      as: 'media',
    });
    MediaModel.belongsTo(PostModel, {
      foreignKey: 'postId',
      as: 'post',
    });
  
    PostModel.belongsToMany(HashtagModel, {
      through: 'PostHashtags',
      foreignKey: 'postId',
      as: 'hashtags',
    });
  }
}

export default PostModel;
