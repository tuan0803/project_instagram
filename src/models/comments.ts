import { Model, Sequelize, ModelScopeOptions, ValidationError } from 'sequelize';
import CommentEntity from '@entities/comments';
import CommentInterface from '@interfaces/comments';
import PostModel from './posts';
import { ModelHooks } from 'sequelize/types/lib/hooks';
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
<<<<<<< HEAD
<<<<<<< HEAD
    async beforeValidate(comment, _options) {
=======
    async beforeValidate(comment, options) {
>>>>>>> 1511fce (xong tag)
      if (comment.parentId) {
        const parentComment = await CommentModel.findByPk(comment.parentId);
        if (!parentComment) {
          throw new ValidationError('Bình luận cha không hợp lệ.');
        }
      }
    },
<<<<<<< HEAD
    async afterValidate(comment, _options) {
      const hashtags = comment.content.match(/#(\w+)/g)?.map(tag => tag.substring(1)) || [];
      if (hashtags.length > 0) {
        const banned = await BannedHashtagModel.findAll({ where: { hashtag: hashtags } });
        if (banned.length > 0) {
          throw new Error(`Bình luận chứa hashtag bị cấm: ${banned.map(tag => `#${tag.hashtag}`).join(", ")}`);
        }
        const allHashtags = await Promise.all(
          hashtags.map(tag => HashtagModel.findOrCreate({ where: { name: tag } }))
        );
        if (allHashtags.length > 0) {
          comment.setDataValue('hashtags', allHashtags.map(([hashtag]) => hashtag));
        }
      }
    
      const taggedUserIds = comment.content.match(/@(\d+)/g)?.map(tag => tag.slice(1)) || [];
      if (taggedUserIds.length > 0) {
        const users = await Promise.all(
          taggedUserIds.map(userId => 
            UserModel.findOne({ 
              where: { id: userId }, 
              attributes: ['id'] 
            })
          )
        );
        const validUsers = users.filter(user => user !== null);
  
        if (validUsers.length > 0) {
          const commentTags = validUsers.map(user => ({ 
            userId: user.id
          }));
          comment.set('commentTags', commentTags);
        }
      }
    },
  };

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
    },
    async afterCreate(comment, options) {
      const taggedUserIds = options.taggedUsers || [];
      if (taggedUserIds.length > 0) {
        const taggedUsers = taggedUserIds.map(userId => ({
          commentId: comment.id,
          userId
        }));
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

  public static associate() {
    this.belongsTo(PostModel, { foreignKey: 'postId', as: 'post', onDelete: 'CASCADE', });
    this.belongsToMany(HashtagModel, { through: CommentHashtagModel, foreignKey: 'commentId', otherKey: 'hashtagId', as: 'hashtags' });
    this.belongsToMany(UserModel, { through: CommentTagModel, foreignKey: 'commentId', otherKey: 'userId', as: 'taggedUsers' });

    this.hasMany(CommentTagModel, { foreignKey: 'commentId', as: 'commentTags',onDelete: 'CASCADE', });
    this.hasMany(CommentHashtagModel, { foreignKey: 'commentId', as: 'commentHashtags',onDelete: 'CASCADE', });
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
