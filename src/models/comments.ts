import { Model, Sequelize, ValidationError } from 'sequelize';
import CommentEntity from '@entities/comments';
import CommentInterface from '@interfaces/comments';
import PostModel from './posts';
import CommentTagModel from './commentTags';
<<<<<<< HEAD
<<<<<<< HEAD
import HashtagModel from './hashtags';
import CommentHashtagModel from './commentHastags';
import UserModel from './users';
import BannedHashtagModel from './bannedHashtags';
=======
import hashtagModel from './hashtags';
=======
import HashtagModel from './hashtags';
import CommentHashtagModel from './commentHastags';
>>>>>>> 1511fce (xong tag)
import UserModel from './users';
>>>>>>> 08f9925 (include)

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
    });
  }

<<<<<<< HEAD
  static readonly hooks: Partial<ModelHooks<CommentModel>> = {
<<<<<<< HEAD
<<<<<<< HEAD
    async beforeValidate(comment, _options) {
=======
    async beforeValidate(comment, options) {
>>>>>>> 1511fce (xong tag)
=======
  static readonly hooks = {
    async beforeValidate(comment, options) {
      if (!comment.content?.trim()) {
        throw new ValidationError('Nội dung bình luận không được để trống.');
      }

>>>>>>> a652d66 (loi tao bang trung gian)
      if (comment.parentId) {
        const parentComment = await CommentModel.findByPk(comment.parentId, { transaction: options.transaction });
        if (!parentComment) {
          throw new ValidationError('Bình luận cha không hợp lệ.');
        }
      }
<<<<<<< HEAD
    },
<<<<<<< HEAD
    async afterValidate(comment, _options) {
=======

>>>>>>> a652d66 (loi tao bang trung gian)
      const hashtags = comment.content.match(/#(\w+)/g)?.map(tag => tag.substring(1)) || [];
      if (hashtags.length > 0) {
        const banned = await BannedHashtagModel.findAll({ where: { hashtag: hashtags }, transaction: options.transaction });
        if (banned.length > 0) {
          throw new ValidationError(`Bình luận chứa hashtag bị cấm: ${banned.map(tag => `#${tag.hashtag}`).join(", ")}`);
        }
      }
      
      comment.setDataValue('_hashtags', hashtags);
      comment.setDataValue('_taggedUserIds', new Set(comment.content.match(/@(\d+)/g)?.map(tag => tag.slice(1)) || []));
    },

    async afterCreate(comment, options) {
      const transaction = options.transaction;
      if (comment.getDataValue('_hashtags')?.length > 0) {
        const allHashtags = await Promise.all(
          comment.getDataValue('_hashtags').map(tag =>
            HashtagModel.findOrCreate({ where: { name: tag }, transaction })
          )
        );

        await CommentHashtagModel.bulkCreate(
          allHashtags.map(([hashtag]) => ({
            commentId: comment.id,
            hashtagId: hashtag.id,
          })),
          { transaction }
        );
      }

      if (comment.getDataValue('_taggedUserIds')?.size > 0) {
        const users = await UserModel.findAll({
          where: { id: Array.from(comment.getDataValue('_taggedUserIds')) },
          attributes: ['id'],
          transaction,
        });

        if (users.length > 0) {
          await CommentTagModel.bulkCreate(
            users.map(user => ({
              commentId: comment.id,
              userId: user.id
            })),
            { transaction }
          );
        }
      }
    },
  };

<<<<<<< HEAD
  static readonly scopes: ModelScopeOptions = {
    byId(id: number) {
      return { where: { id } };
    },
    async afterCreate(comment, options) {
        const transaction = options.transaction || await CommentModel.sequelize!.transaction();
=======
=======
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
>>>>>>> 1511fce (xong tag)
  };

  static readonly scopes: ModelScopeOptions = {
    byId(id: number) {
      return { where: { id } };
    },
  };
>>>>>>> 08f9925 (include)

=======
>>>>>>> a652d66 (loi tao bang trung gian)
  public static associate() {
    this.belongsTo(PostModel, { foreignKey: 'postId', as: 'post', onDelete: 'CASCADE' });
    this.belongsToMany(UserModel, { through: CommentTagModel, foreignKey: 'commentId', otherKey: 'userId', as: 'users' });
    this.hasMany(CommentTagModel, { foreignKey: 'commentId', as: 'commentTags', onDelete: 'CASCADE' });
    this.belongsToMany(HashtagModel, { through: CommentHashtagModel, foreignKey: 'commentId', otherKey: 'hashtagId', as: 'hashtags' });
<<<<<<< HEAD
    this.belongsToMany(UserModel, { through: CommentTagModel, foreignKey: 'commentId', otherKey: 'userId', as: 'taggedUsers' });

    this.hasMany(CommentTagModel, { foreignKey: 'commentId', as: 'commentTags', onDelete: 'CASCADE', });
    this.hasMany(CommentHashtagModel, { foreignKey: 'commentId', as: 'commentHashtags', onDelete: 'CASCADE', });
=======
    this.hasMany(CommentHashtagModel, { foreignKey: 'commentId', as: 'commentHashtags', onDelete: 'CASCADE' });
>>>>>>> a652d66 (loi tao bang trung gian)
  }
}

export default CommentModel;
