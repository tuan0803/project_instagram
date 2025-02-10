import { Model, Sequelize, ModelScopeOptions } from 'sequelize';
import PostEntity from '@entities/posts';
import PostInterface from '@interfaces/posts';
import MediaModel from '@models/medias';
import HashtagModel from '@models/hashtags';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import FileUploaderService from '@services/fileUploader';
import fs from 'fs';
import path from 'path';
import PostHashtagsInterface from '@interfaces/post_hashtags';
import HashtagInterface from '@interfaces/hashtags';

class PostModel extends Model<PostInterface> implements PostInterface {
  public id: number;
  public userId: number;
  public text?: string;
  public createdAt: Date;
  public updatedAt: Date;
  declare hashtagsList?: string[];

  static readonly CREATABLE = ['userId', 'text'];

  static readonly hooks: Partial<ModelHooks<PostModel>> = {
    async beforeCreate(post) {
      if (post.text) {
        post.hashtagsList = post.text.match(/#[\w]+/g)?.map(tag => tag.toLowerCase()) ?? [];
      }
    },

    async afterCreate(post, options) {
      if (!post.hashtagsList?.length) return;
      const externalTransaction = !!options?.transaction;
      const transaction = options?.transaction ?? await PostModel.sequelize?.transaction();

      try {
        const hashtagInstances = await Promise.all(
          post.hashtagsList.map(tag =>
            HashtagModel.findOrCreate({
              where: { name: tag },
              defaults: { name: tag } as Partial<HashtagInterface>,
              transaction
            })
          )
        );
        await post.setHashtags(hashtagInstances.map(([hashtag]) => hashtag), { transaction });
        if (!externalTransaction) {
          await transaction.commit();
        }
      } catch (error) {
        if (!externalTransaction) {
          await transaction.rollback();
        }
        throw new Error(`Error saving hashtags: ${error.message}`);
      }
    }
  };


  static readonly scopes: ModelScopeOptions = {
    byId(id) {
      return {
        where: { id },
      };
    },
  };

  public static initialize(sequelize: Sequelize) {
    this.init(PostEntity, {
      hooks: PostModel.hooks,
      sequelize,
      tableName: 'posts',
      timestamps: false,
    });
  }

  public static associate() {
    PostModel.hasMany(MediaModel, {
      foreignKey: 'postId',
      as: 'media',
    });
    MediaModel.belongsTo(PostModel, {
      foreignKey: 'postId',
      as: 'post',
    });

    PostModel.belongsToMany(HashtagModel, {
      through: 'PostHashtagsModel', // bang trung gian
      foreignKey: 'postId',
      as: 'hashtags',
    });
  }

  public static async createPost(userId: number, text: string, mediaBuffer?: Express.Multer.File) {
    const transaction = await PostModel.sequelize?.transaction();
    try {
      const post = await PostModel.create(
        { userId, text } as any,
        { transaction }
      );

      if (mediaBuffer) {
        const buffer = mediaBuffer.buffer || fs.readFileSync(mediaBuffer.path);
        const fileNameSource = mediaBuffer.name;
        const extension = path.extname(fileNameSource).toLowerCase();
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv'];
        let fileType: 'image' | 'video' | null = null;
        if (imageExtensions.includes(extension)) {
          fileType = 'image';
        } else if (videoExtensions.includes(extension)) {
          fileType = 'video';
        } else {
          throw new Error('Unsupported media format');
        }
        const fileName = `${userId}_${Date.now()}${extension}`;
        const url = await FileUploaderService.singleUpload(buffer, fileName);
        await MediaModel.create(
          { postId: post.id, url, type: fileType },
          { transaction }
        );
      }

      await transaction.commit();
      return post;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error creating post: ${error.message}`);
    }
  }

}

export default PostModel;