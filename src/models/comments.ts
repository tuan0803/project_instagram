import { Model, Sequelize, ModelScopeOptions } from 'sequelize';
import CommentEntity from '@entities/comments';
import CommentInterface from '@interfaces/comments';

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
