import { Model, Sequelize, ModelScopeOptions } from 'sequelize';
import MediaTagEntity from '@entities/media_tags';
import MediaTagInterface from '@interfaces/media_tags';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class MediaTagModel extends Model<MediaTagInterface> implements MediaTagInterface {
  public id: number;
  public userId: number;
  public mediaId: number;
  public xCoordinate: number;
  public yCoordinate: number;


  static readonly hooks: Partial<ModelHooks<MediaTagModel>> = {
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
    this.init(MediaTagEntity, {
      hooks: MediaTagModel.hooks,
      tableName: 'medias',
      sequelize,
      timestamps: false,
    });
  }

  public static associate() {
  }
}

export default MediaTagModel;
