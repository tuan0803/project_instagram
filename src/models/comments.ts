import { Model, Sequelize, ModelScopeOptions } from 'sequelize';
import CommentEntity from '@entities/comments';
import CommentInterface, { CommentCreationAttributes } from '@interfaces/comments';

class CommentModel extends Model<CommentInterface, CommentCreationAttributes> implements CommentInterface {
  public id: number;
  public postId: number;
  public userId: number;
  public content: string;
  public parentId?: number;
  public createdAt: Date;

  static readonly NOTIFIABLE_TYPE_ENUM = {
    SYSTEM: 'system',
  };

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return {
        where: { id },
      };
    },
  };

  public static initialize (sequelize: Sequelize) {
    this.init(CommentEntity, {
      tableName: 'comments',
      sequelize,
      timestamps: false,
      modelName: 'Comment',
    });
  }

  public static associate () {
  }
}

export default CommentModel;
