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

<<<<<<< HEAD
  static associate() {
  }
=======
  public static associate() {
  }
<<<<<<< HEAD
  
>>>>>>> 37243e4 (comment)
=======
>>>>>>> 1511fce (xong tag)
}

export default CommentTagModel;
