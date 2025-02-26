import { Model, ModelValidateOptions, Sequelize, Transaction, ValidationError, ValidationErrorItem } from 'sequelize';
import CommentEntity from '@entities/comments';
import CommentInterface from '@interfaces/comments';
import PostModel from './posts';
import CommentTagModel from './commentTags';
import HashtagModel from './hashtags';
import CommentHashtagModel from './commentHashtags';
import UserModel from './users';
import BannedWordModel from './bannedWords';
import CommentReactionsModel from './commentReactions';

class CommentModel extends Model<CommentInterface> implements CommentInterface {
  public id: number;
  public postId: number;
  public userId: number;
  public content: string;
  public parentId?: number;
  public createdAt: Date;

  public static initialize(sequelize: Sequelize) {
    this.init(CommentEntity, {
      tableName: 'comments',
      sequelize,
      validate: this.validations,
      timestamps: false,
      hooks: this.hooks,
    });
  }

  static readonly hooks = {
    async beforeValidate(comment) {
      await CommentModel.processCommentContent(comment);
    },

    async afterCreate(comment, options) {
      const transaction = options.transaction;
      await CommentModel.saveTags(comment, transaction);
    },

    async beforeUpdate(comment, options) {
      const transaction = options.transaction;
      if (comment.changed("content")) {
        await CommentModel.processCommentContent(comment);
        await CommentModel.removeTags(comment.id, transaction);
        await CommentModel.saveTags(comment, transaction);
      }
    },

    async afterDestroy(comment, options) {
      const transaction = options.transaction;
      await CommentModel.removeTags(comment.id, transaction);
    }
  };

  static async extractTags(content: string) {
    if (!content || typeof content !== 'string') {
      return { hashtags: [], taggedUserIds: [] };
    }
    const hashtags = (content.match(/#\w+/g) || []).map(tag => tag.substring(1));
    const taggedUserIds = (content.match(/@\d+/g) || []).map(tag => Number(tag.substring(1)));
    return { hashtags, taggedUserIds };
  }

  static async checkBannedContent(content: string): Promise<string> {
    const bannedWords = await BannedWordModel.findAll({ attributes: ['words'] });
    let updatedContent = content;
    for (const word of bannedWords) {
      const regex = new RegExp(`\\b${word.words.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      updatedContent = updatedContent.replace(regex, '***');
    }
    return updatedContent;
  }

  static async processCommentContent(comment) {
    comment.content = await CommentModel.checkBannedContent(comment.content);
    const { hashtags, taggedUserIds } = await CommentModel.extractTags(comment.content);

    const existingHashtags = await HashtagModel.findAll({
      where: { name: hashtags },
      attributes: ['id', 'name'],
    });

    const bannedWords = await BannedWordModel.findAll({ attributes: ['words'] });
    const bannedSet = new Set(bannedWords.map(bw => bw.words));

    let processedContent = comment.content;
    const newHashtags = [];

    for (const tag of hashtags) {
      if (bannedSet.has(tag)) {
        processedContent = processedContent.replace(new RegExp(`#${tag}\\b`, 'g'), '***');
      } else {
        const found = existingHashtags.find(h => h.name === tag);
        if (found) {
          processedContent = processedContent.replace(new RegExp(`#${tag}\\b`, 'g'), `#${found.id}`);
        } else {
          newHashtags.push(tag);
        }
      }
    }

    comment.content = processedContent;
    comment.setDataValue('_hashtags', newHashtags);
    comment.setDataValue('_taggedUserIds', taggedUserIds);
  }
  static async saveTags(comment, transaction) {
    const newHashtags = comment.getDataValue('_hashtags') || [];
    if (newHashtags.length > 0) {
      const createdHashtags = await Promise.all(
        newHashtags.map(tag =>
          HashtagModel.create({ name: tag }, { transaction })
        )
      );
      await comment.setHashtags(
        createdHashtags.map(hashtag => hashtag),
        { transaction }
      );

      comment.content = newHashtags.reduce(
        (content, tag, index) => content.replace(new RegExp(`#${tag}\\b`, 'g'), `#${createdHashtags[index].id}`),
        comment.content
      );
    }

    const taggedUserIds = comment.getDataValue('_taggedUserIds') || [];
    if (taggedUserIds.length > 0) {
      await comment.setUsers(taggedUserIds, { transaction });
    }
  }

  static async removeTags(commentId, transaction) {
    await CommentHashtagModel.destroy({
      where: { commentId },
      transaction,
    });

    await CommentTagModel.destroy({
      where: { commentId },
      transaction,
    });
  }

  static readonly validations: ModelValidateOptions = {
    async isContentValid() {
      if (!this.content?.trim()) {
        throw new ValidationError('Validation Error', [
          new ValidationErrorItem('Nội dung bình luận không được để trống.', 'Validation error', 'content', this.content)
        ]);
      }
      const post = await PostModel.findByPk(this.postId);
      if (!post) {
        throw new ValidationError('Validation Error', [
          new ValidationErrorItem(`ID bài viết ${this.postId} không hợp lệ.`, 'Validation error', 'postId', this.postId)
        ]);
      }
      if (this.parentId) {
        const parentComment = await CommentModel.findByPk(this.parentId);
        if (!parentComment) {
          throw new ValidationError('Validation Error', [
            new ValidationErrorItem(`Bình luận cha với ID ${this.parentId} không tồn tại.`, 'Validation error', 'parentId', this.parentId)
          ]);
        }
        if (parentComment.postId !== this.postId) {
          throw new ValidationError('Validation Error', [
            new ValidationErrorItem('Bình luận cha phải thuộc cùng bài viết.', 'Validation error', 'parentId', this.parentId)
          ]);
        }
      }
    }
  };

  public static associate() {
    this.belongsTo(PostModel, { foreignKey: 'postId', as: 'post', onDelete: 'CASCADE' });
    this.belongsToMany(UserModel, { through: CommentTagModel, foreignKey: 'commentId', otherKey: 'userId', as: 'users' });
    this.hasMany(CommentTagModel, { foreignKey: 'commentId', as: 'commentTags', onDelete: 'CASCADE' });
    this.belongsToMany(HashtagModel, { through: CommentHashtagModel, foreignKey: 'commentId', otherKey: 'hashtagId', as: 'hashtags' });
    this.hasMany(CommentHashtagModel, { foreignKey: 'commentId', as: 'commentHashtags', onDelete: 'CASCADE' });
    this.hasMany(CommentReactionsModel, { foreignKey: 'comment_id', as: 'commentReactions', onDelete: 'CASCADE' });
  }
}

export default CommentModel;
