import { Model, Sequelize, ModelScopeOptions } from 'sequelize';
import PostEntity from '@entities/posts';
import PostInterface, { PostCreationAttributes } from '@interfaces/posts';
import MediaModel from '@models/medias'; // Đảm bảo import đúng MediaModel
import { ModelHooks } from 'sequelize/types/lib/hooks';

class PostModel extends Model<PostInterface, PostCreationAttributes> implements PostInterface {
  public id: number;
  public userId: number;
  public text?: string;
  public createdAt: Date;
  public updatedAt: Date;

  static readonly NOTIFIABLE_TYPE_ENUM = {
    SYSTEM: 'system',
  };

  static readonly hooks: Partial<ModelHooks<PostModel>> = {
    async beforeCreate (record) {
      // Thực hiện trước khi tạo bản ghi, có thể thêm logic xử lý
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

  public static associate () {
    PostModel.hasMany(MediaModel, {
      foreignKey: 'postId',
      as: 'media',
    });
    MediaModel.belongsTo(PostModel, {
      foreignKey: 'postId',
      as: 'post',
    });
  }
}

export default PostModel;
