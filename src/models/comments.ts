import { Model, Sequelize, ModelScopeOptions } from 'sequelize';
import CommentEntity from '@entities/comments';
import CommentInterface from '@interfaces/comments';
import PostModel from './posts';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import PostCommentCountModel from './postCommentCounts';

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

  static readonly hooks: Partial<ModelHooks<CommentModel>> = {
    async beforeCreate(comment: CommentModel) {
      const post = await PostModel.findByPk(comment.postId);
      if (!post) {
        throw new Error('Bài viết không tồn tại.');
      }
    },

    async afterCreate(comment, options) {
      const transaction = options.transaction || await CommentModel.sequelize!.transaction();
      try {
        const [postCommentCount, created] = await PostCommentCountModel.findOrCreate({
          where: { postId: comment.postId },
          defaults: { commentCount: 1 },
          transaction,
        });

        if (!created) {
          await postCommentCount.increment('commentCount', { by: 1, transaction });
        }

        if (!options.transaction) {
          await transaction.commit();
        }
      } catch (error) {
        if (!options.transaction) {
          await transaction.rollback();
        }
        throw new Error(`Lỗi khi xử lý afterCreate của CommentModel: ${error.message}`);
      }
    },
    
    async afterDestroy(comment, options) {
      const transaction = options.transaction || await CommentModel.sequelize!.transaction();
      try {
        const postCommentCount = await PostCommentCountModel.findOne({
          where: { postId: comment.postId },
          transaction,
        });

        if (postCommentCount && postCommentCount.commentCount > 0) {
          await postCommentCount.decrement('commentCount', { by: 1, transaction });
        }

        if (!options.transaction) {
          await transaction.commit();
        }
      } catch (error) {
        if (!options.transaction) {
          await transaction.rollback();
        }
        throw new Error(`Lỗi khi xử lý afterDestroy của CommentModel: ${error.message}`);
      }
    },

    async afterDestroy(comment, options) {
      const transaction = options.transaction || await CommentModel.sequelize!.transaction();
      try {
        const postCommentCount = await PostCommentCountModel.findOne({
          where: { postId: comment.postId },
          transaction,
        });

        if (postCommentCount && postCommentCount.commentCount > 0) {
          await postCommentCount.decrement('commentCount', { by: 1, transaction });
        }

        if (!options.transaction) {
          await transaction.commit();
        }
      } catch (error) {
        if (!options.transaction) {
          await transaction.rollback();
        }
        throw new Error(`Lỗi khi xử lý afterDestroy của CommentModel: ${error.message}`);
      }
    },
  };

  public static initialize(sequelize: Sequelize) {
    this.init(CommentEntity, {
      tableName: 'comments',
      sequelize,
      timestamps: false,
      modelName: 'Comment',
      hooks: this.hooks,
    });
  }

  static readonly scopes: ModelScopeOptions = {
    byId(id: number) {
      return { where: { id } };
    },
  };

  public static associate() {
    this.belongsTo(PostModel, { foreignKey: 'postId' });
  }

  public static async getComments(postId: number, page = 1, limit = 15) {
    const offset = (page - 1) * limit;
    return this.findAll({
      where: { postId },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
  }

  public static async createComment(postId: number, userId: number, content: string, parentId?: number) {
    return this.create({
      postId,
      userId,
      content,
      parentId: parentId || null,
    });
  }

  public static async updateComment(id: number, content: string) {
    const comment = await this.findByPk(id);
    if (!comment) return null;
    await comment.update({ content });
    return comment;
  }

  public static async deleteComment(id: number) {
    const comment = await this.findByPk(id);
    if (!comment) return null;
    await comment.destroy();
    return true;
  }
}

export default CommentModel;
