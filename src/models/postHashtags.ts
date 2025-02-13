import { Model, Sequelize, ModelScopeOptions } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import PostHashtagsInterface from '@interfaces/postHashtags';
import PostHashtagsEntity from '@entities/postHashtags';
import PostModel from './posts';
import HashtagModel from './hashtags';

class PostHashtagsModel extends Model<PostHashtagsInterface> implements PostHashtagsInterface {
  public id: number;
  public postId: number;
  public hashtagId: number;

  static readonly CREATABLE = ['postId', 'hashtagId'];

  static readonly hooks: Partial<ModelHooks<PostHashtagsModel>> = {
    async beforeCreate(record) {
    },

    async afterCreate(record) {
      console.log('Done post:', record);
    },
  };

  static readonly scopes: ModelScopeOptions = {
    byId(id) {
      return {
        where: { id },
      };
    },
  };

  public static initialize(sequelize: Sequelize) {
    this.init(PostHashtagsEntity, {
      hooks: PostHashtagsModel.hooks,
      sequelize,
      tableName: 'post_hashtags',
      timestamps: false,
    });
  }

  public static associate() {
  }
}

export default PostHashtagsModel;
