import { Model, Sequelize, ModelScopeOptions, ValidationError } from 'sequelize';
import LikeEntity from '@entities/likes';
import LikeInterface from '@interfaces/likes';
import PostModel from './posts';
import UserModel from './users';

class LikeModel extends Model<LikeInterface> implements LikeInterface {
  public id: number;
  public postId: number;
  public userId: number;
  public createdAt: Date;

  public static initialize(sequelize: Sequelize) {
    this.init(LikeEntity, {
      tableName: 'likes',
      sequelize,
      timestamps: false,
      hooks: this.hooks,
    });
  }

  static readonly hooks = {
    async beforeValidate(like, options) {
      const post = await PostModel.findByPk(like.postId);
      if (!post) {
        throw new ValidationError('Bài viết không tồn tại.');
      }
      const existingLike = await LikeModel.findOne({
        where: { postId: like.postId, userId: like.userId },
      });
      if (existingLike) {
        throw new ValidationError('Người dùng đã thích bài viết này.');
      }
    },
  };

  static readonly scopes: ModelScopeOptions = {
    byId(id: number) {
      return { where: { id } };
    },
    byPost(postId: number) {
      return { where: { postId } };
    },
    byUser(userId: number) {
      return { where: { userId } };
    },
  };

  public static associate() {
    this.belongsTo(PostModel, { foreignKey: 'postId', as: 'post', onDelete: 'CASCADE' });
    this.belongsTo(UserModel, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
    
  }
}

export default LikeModel;
