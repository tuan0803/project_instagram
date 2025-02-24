import { Model, Sequelize, Transaction, ValidationError } from 'sequelize';
import CommentEntity from '@entities/comments';
import CommentInterface from '@interfaces/comments';
import PostModel from './posts';
import CommentTagModel from './commentTags';
import HashtagModel from './hashtags';
import CommentHashtagModel from './commentHashtags';
import UserModel from './users';
import BannedHashtagModel from './bannedHashtags';
import BannedWordModel from './bannedWords';

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
      timestamps: false,
      hooks: this.hooks,
    });
  }

  static readonly hooks = {
    async afterFind(comments) {
      if (!comments) return;
      const commentList = Array.isArray(comments) ? comments : [comments];

      for (const comment of commentList) {
        const hashtags = await comment.getHashtags();
        let updatedContent = comment.content;
        for (const hashtag of hashtags) {
          const regex = new RegExp(`#${hashtag.name}\\b`, "g");
          updatedContent = updatedContent.replace(regex, `#${hashtag.id}`);
        }
        await comment.setDataValue('content', updatedContent);
      }
    },

    async beforeValidate(comment, options) {
      const { hashtags, taggedUserIds } = await CommentModel.validation(
        comment.content,
        comment.postId,
        comment.parentId,
        options.transaction
      );

      await comment.setDataValue('_hashtags', hashtags);
      await comment.setDataValue('_taggedUserIds', taggedUserIds);
    },

    async afterCreate(comment, options) {
      const transaction = options.transaction;
      const hashtags = comment.getDataValue('_hashtags') || [];
      if (hashtags.length > 0) {
        const allHashtags = await Promise.all(
          hashtags.map(tag =>
            HashtagModel.findOrCreate({ where: { name: tag }, transaction })
          )
        );
        await comment.setHashtags(
          allHashtags.map(([hashtag]) => hashtag),
          { transaction }
        );
      }
      const taggedUserIds = comment.getDataValue('_taggedUserIds') || [];
      if (taggedUserIds.length > 0) {
        await comment.setUsers(taggedUserIds, { transaction });
      }
    },

    async beforeUpdate(comment, options) {
      const transaction = options.transaction;
      if (comment.changed("content")) {
        const { hashtags, taggedUserIds } = await CommentModel.validation(
          comment.content,
          comment.postId,
          comment.parentId,
          transaction
        );
      }
      if (comment.changed("content")) {
        await CommentHashtagModel.destroy({
          where: { commentId: comment.id },
          transaction,
        });
        await CommentTagModel.destroy({
          where: { commentId: comment.id },
          transaction,
        });
        const hashtags = comment.getDataValue('_hashtags') || [];
        if (hashtags.length > 0) {
          const allHashtags = await Promise.all(
            hashtags.map(tag =>
              HashtagModel.findOrCreate({ where: { name: tag }, transaction })
            )
          );
          await comment.setHashtags(
            allHashtags.map(([hashtag]) => hashtag),
            { transaction }
          );
        }
        const taggedUserIds = comment.getDataValue('_taggedUserIds') || [];
        if (taggedUserIds.length > 0) {
          await comment.setUsers(taggedUserIds, { transaction });
        }
      }
    },

    async afterDestroy(comment, options) {
      const transaction = options.transaction;
      await CommentHashtagModel.destroy({
        where: { commentId: comment.id },
        transaction
      });
      await CommentTagModel.destroy({
        where: { commentId: comment.id },
        transaction
      });
    }
  };

  static async validation(content: string, postId: number, parentId?: number, transaction?: Transaction) {
    if (!content?.trim()) {
      throw new ValidationError('Nội dung bình luận không được để trống.');
    }
    if (parentId) {
      const parentComment = await CommentModel.findByPk(parentId, { transaction });
      if (!parentComment) {
        throw new ValidationError('Bình luận cha không hợp lệ.');
      }
    }
    //hashtag
    const hashtags = content.match(/#(\w+)/g)?.map(tag => tag.substring(1)) || [];
    const taggedUserIds = content.match(/@(\d+)/g)?.map(tag => parseInt(tag.slice(1))) || [];
    if (hashtags.length > 0) {
      const banned = await BannedHashtagModel.findAll({ where: { hashtag: hashtags }, transaction });
      if (banned.length > 0) {
        throw new ValidationError(`Bình luận chứa hashtag bị cấm: ${banned.map(tag => `#${tag.hashtag}`).join(", ")}`);
      }
    }
    //words
    const bannedWords = await BannedWordModel.findAll({ attributes: ['words'], transaction });
    const bannedList = bannedWords.map(bw => bw.words.toLowerCase());
    for (const words of bannedList) {
      const regex = new RegExp(`\\b${words}\\b`, 'i');
      if (regex.test(content)) {
        throw new ValidationError(`Bình luận chứa từ ngữ bị cấm: "${words}"`);
      }
    }

    const post = await PostModel.findByPk(postId, { transaction });
    if (!postId || isNaN(postId)) {
      throw new ValidationError(`ID bài viết ${postId} không hợp lệ.`);
    }

    return { hashtags, taggedUserIds };
  }


  public static associate() {
    this.belongsTo(PostModel, { foreignKey: 'postId', as: 'post', onDelete: 'CASCADE' });

    this.belongsToMany(UserModel, { through: CommentTagModel, foreignKey: 'commentId', otherKey: 'userId', as: 'users' });
    this.hasMany(CommentTagModel, { foreignKey: 'commentId', as: 'commentTags', onDelete: 'CASCADE' });

    this.belongsToMany(HashtagModel, { through: CommentHashtagModel, foreignKey: 'commentId', otherKey: 'hashtagId', as: 'hashtags' });
    this.hasMany(CommentHashtagModel, { foreignKey: 'commentId', as: 'commentHashtags', onDelete: 'CASCADE' });
  }
}

export default CommentModel;