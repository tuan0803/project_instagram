import { Model, Sequelize, ModelScopeOptions } from 'sequelize';
import MediaEntity from '@entities/medias';
import MediaInterface from '@interfaces/medias';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class MediaModel extends Model<MediaInterface> implements MediaInterface {
  public postId: number;
  public url: string;
  public type?: 'image' | 'video';

  static readonly hooks: Partial<ModelHooks<MediaModel>> = {
    async beforeCreate(record) {
    },
    async afterCreate(record) {
      console.log('Done media:', record);
    },
  };

  static readonly scopes: ModelScopeOptions = {
    byPost(post_id) {
      return {
        where: { post_id: post_id },
      };
    },
    byType(type) {
      return {
        where: { type: type },
      };
    },
  };

  public static initialize(sequelize: Sequelize) {
    this.init(MediaEntity, {
      hooks: MediaModel.hooks,
      tableName: 'medias',
      sequelize,
      timestamps: false,
    });
  }

  public static associate() {
  }
}

export default MediaModel;