import { Model, Sequelize, ModelScopeOptions, ValidationError } from 'sequelize';
import CommentEntity from '@entities/comments';
import CommentInterface from '@interfaces/comments';
import PostModel from './posts';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import CommentTagModel from './commentTags';
import HashtagModel from './hashtags';
import CommentHashtagModel from './commentHastags';
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
    async beforeValidate(comment, options) {
      if (comment.parentId) {
        const parentComment = await CommentModel.findByPk(comment.parentId);
        if (!parentComment) {
          throw new ValidationError('Bình luận cha không hợp lệ.');
        }
      }
    },
    async afterValidate(comment, options) {
      const hashtags = comment.content.match(/#(\w+)/g)?.map(tag => tag.substring(1)) || [];
      if (hashtags.length > 0) {
        const allHashtags = await Promise.all(
          hashtags.map(tag => HashtagModel.findOrCreate({ where: { name: tag } }))
        );
        comment.setDataValue('hashtags', allHashtags.map(([hashtag]) => hashtag));
      }

      const taggedUserIds = comment.content.match(/@(\d+)/g)?.map(mention =>
        mention.substring(1)).filter((value, index, self) => self.indexOf(value) === index)
      if (taggedUserIds.length > 0) {
        comment.setDataValue('taggedUserIds', taggedUserIds);
      }
    },
  };

  static readonly scopes: ModelScopeOptions = {
    byId(id: number) {
      return { where: { id } };
    },
  };

  public static associate() {
    this.belongsTo(PostModel, { foreignKey: 'postId', as: 'post', onDelete: 'CASCADE', });
    this.belongsToMany(HashtagModel, { through: CommentHashtagModel, foreignKey: 'commentId', otherKey: 'hashtagId', as: 'hashtags' });
    this.belongsToMany(UserModel, { through: CommentTagModel, foreignKey: 'commentId', otherKey: 'userId', as: 'taggedUsers' });

    this.hasMany(CommentTagModel, { foreignKey: 'commentId', as: 'commentTags', onDelete: 'CASCADE', });
    this.hasMany(CommentHashtagModel, { foreignKey: 'commentId', as: 'commentHashtags', onDelete: 'CASCADE', });
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
