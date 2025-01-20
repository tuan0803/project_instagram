import { Model, Sequelize, ModelScopeOptions } from 'sequelize';
import MediaEntity from '@entities/medias';
import MediaInterface, { MediaCreationAttributes } from '@interfaces/medias';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class MediaModel extends Model<MediaInterface, MediaCreationAttributes> implements MediaInterface {
  public id: number;
  public postId: number;
  public url: string;
  public type: string;

  static readonly NOTIFIABLE_TYPE_ENUM = {
    SYSTEM: 'system',
  };

  static readonly hooks: Partial<ModelHooks<MediaModel>> = {
    async beforeCreate (record) {
    },
    async afterCreate (record) {
      console.log('Done media:', record);
    },
  };

  static readonly scopes: ModelScopeOptions = {
    byPost (post_id) {
      return {
        where: { post_id: post_id },
      };
    },
    byType (type) {
      return {
        where: { type: type },
      };
    },
  };

  public static initialize (sequelize: Sequelize) {
    this.init(MediaEntity, {
      hooks: MediaModel.hooks,
      tableName: 'medias',
      sequelize,
    });
  }

  public static associate () {
  }
}

export default MediaModel;
