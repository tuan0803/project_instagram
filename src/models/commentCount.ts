import { Model, DataTypes, Sequelize } from 'sequelize';
import PostModel from './posts';

class PostCommentCountModel extends Model {
  public postId!: number;
  public commentCount!: number;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        postId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          unique: true,
          primaryKey: true,
          field: 'post_id',
          references: { model: 'posts', key: 'id' },
        },
        commentCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'comment_count',
        },
      },
      {
        sequelize,
        tableName: 'post_comment_counts',
        timestamps: false,
      }
    );
  }

  public static associate() {
    PostCommentCountModel.belongsTo(PostModel, { foreignKey: 'postId', as: 'posts' });
  }
}

export default PostCommentCountModel;
