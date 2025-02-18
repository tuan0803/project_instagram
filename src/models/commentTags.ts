import { Model, DataTypes, Sequelize } from 'sequelize';
import CommentModel from './comments';
import UserModel from './users';
import commentTagEntity from '@entities/commentTags';

class CommentTagModel extends Model {
  public id: number;
  public commentId: number;
  public userId: number;
  public createdAt: Date;

  public static initialize(sequelize: Sequelize) {
    this.init(commentTagEntity, {
      sequelize,
      tableName: 'comment_tags',
      timestamps: false,
    });
  }

  public static associate() {
  }
}

export default CommentTagModel;
