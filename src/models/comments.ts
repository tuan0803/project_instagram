import { Model, Sequelize, ModelScopeOptions, ValidationError } from 'sequelize';
import CommentEntity from '@entities/comments';
import CommentInterface from '@interfaces/comments';
import PostModel from './posts';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import CommentCountModel from './commentCount';
import UserModel from './users';
import CommentTagModel from './commentTags';

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

  private static async updateCommentCount(comment: CommentModel, transaction: Transaction) {
    const [postCommentCount, created] = await CommentCountModel.findOrCreate({
      where: { postId: comment.postId },
      defaults: { commentCount: 1 },
      transaction,
    });

    if (!created) {
      await postCommentCount.increment('commentCount', { by: 1, transaction });
    }
  }

  static readonly hooks: Partial<ModelHooks<CommentModel>> = {
    async beforeCreate(comment, options) {
      const transaction = options.transaction || await CommentModel.sequelize!.transaction();
      try {
        
      } catch (error) {
        
      }
    },
    async afterCreate(comment, options) {
        const transaction = options.transaction || await CommentModel.sequelize!.transaction();

        try {
          await CommentModel.updateCommentCount(comment, transaction);

          if (!options.transaction) {
            await transaction.commit();
          }
        } catch (error: any) {
          if (!options.transaction) {
            await transaction.rollback();
          }
          throw new Error(`Lỗi khi xử lý afterCreate của CommentModel: ${error.message}`);
        }
      },

    async afterValidate(comment, options) {
      },

    async afterDestroy(comment, options) {
        const transaction = options.transaction || await CommentModel.sequelize!.transaction();
        try {
          const postCommentCount = await CommentCountModel.findOne({
            where: { postId: comment.postId },
            transaction,
          });
          if (postCommentCount && postCommentCount.commentCount > 0) {
            await postCommentCount.decrement('commentCount', { by: 1, transaction });
          }
          if (!options.transaction) {
            await transaction.commit();
          }
        } catch (error: any) {
          if (!options.transaction) {
            await transaction.rollback();
          }
          throw new Error(`Lỗi khi xử lý afterDestroy của CommentModel: ${error.message}`);
        }
      },
    };

    static readonly scopes: ModelScopeOptions = {
      byId(id: number) {
        return { where: { id } };
      },
    };

    public static associate() {
      this.belongsTo(PostModel, { foreignKey: 'postId' });
      this.belongsTo(CommentCountModel, { as: 'commentCount', foreignKey: 'postId' });

      this.hasMany(CommentTagModel, { foreignKey: 'commentId', as: 'commentTags' });
      this.belongsTo(CommentModel, { foreignKey: 'parentId', as: 'parentComment' });
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
