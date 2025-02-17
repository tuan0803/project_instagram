import { Model, Sequelize, ModelScopeOptions, ValidationError } from 'sequelize';
import CommentEntity from '@entities/comments';
import CommentInterface from '@interfaces/comments';
import PostModel from './posts';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import CommentTagModel from './commentTags';
import hashtagModel from './hashtags';
import UserModel from './users';

class CommentModel extends Model<CommentInterface> implements CommentInterface {
  public id: number;
  public postId: number;
  public userId: number;
  public content: string;
  public parentId?: number;
  public createdAt: Date;

  static readonly NOTIFIABLE_TYPE_ENUM = {
    SYSTEM: 'system',
  };

  public static initialize(sequelize: Sequelize) {
    this.init(CommentEntity, {
      tableName: 'comments',
      sequelize,
      timestamps: false,
      hooks: this.hooks,
    });
  }

  static readonly hooks: Partial<ModelHooks<CommentModel>> = {
  };

  static readonly scopes: ModelScopeOptions = {
    byId(id: number) {
      return { where: { id } };
    },
  };

  public static associate() {
    this.belongsTo(PostModel, { foreignKey: 'postId' });

    this.hasMany(CommentTagModel, { foreignKey: 'commentId', as: 'commentTags' });
    this.belongsTo(CommentModel, { foreignKey: 'parentId', as: 'parentComment' });

    this.hasMany(hashtagModel, { foreignKey: 'id', as: 'hashtags' });
    this.belongsToMany(UserModel, { through: CommentTagModel, foreignKey: 'commentId', otherKey: 'userId', as: 'taggedUsers', });
  }

  static readonly validations = {
    async validateId(id: number): Promise<CommentModel> {
      const comment = await CommentModel.findByPk(id);
      if (!comment) {
        throw new ValidationError('Bình luận không tồn tại.');
      }
      return comment;
    },
  };
}

export default CommentModel;
