import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '@initializers/sequelize';
import { CommentAttributes, CommentCreationAttributes } from '@interfaces/comment';

class CommentModel extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: number;
  public postId!: number;
  public userId!: number;
  public content!: string;
  public parentId!: number | null;
  public createdAt!: Date;

  static readonly hooks = {
    async beforeCreate(record: CommentModel) {},
    async afterCreate(record: CommentModel) {},
  };

  static readonly scopes = {
    byPost(postId: number) {
      return { where: { postId } };
    },
    byUser(userId: number) {
      return { where: { userId } };
    },
    parentComments(postId: number, parentId : number) {
      return { where: { postId, parentId } };
    },
  };

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        postId: { type: DataTypes.INTEGER, allowNull: false },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false },
        parentId: { type: DataTypes.INTEGER, allowNull: true },
        createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      },
      {
        sequelize,
        tableName: 'comments',
        timestamps: false,
        hooks: CommentModel.hooks,
        scopes: CommentModel.scopes,
      }
    );
  }

  public static async addComment(postId: number, userId: number, content: string, parentId?: number) {
    return await CommentModel.create({ postId, userId, content, parentId });
  }

  public static async getNestedComments(postId: number, parentId: number | null = null): Promise<CommentAttributes[]> {
    const comments = await CommentModel.findAll({
      where: { postId, parentId },
      order: [['createdAt', 'ASC']],
      raw: true,
    });
    
    return Promise.all(
      comments.map(async (comment) => ({
        ...comment,
        replies: await CommentModel.getNestedComments(postId, comment.id),
      }))
    );
  }
  public static associate() {

    }
}

export default CommentModel;
