import { Model, Sequelize, ModelScopeOptions } from 'sequelize';
import PostEntity from '@entities/posts';
import PostInterface from '@interfaces/posts';
import MediaModel from '@models/medias';
import HashtagModel from '@models/hashtags';
import PostHashtagsModel from '@models/post_hashtags';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import FileUploaderService from '@services/fileUploader';
import fs from 'fs';
import path from 'path';

class PostModel extends Model<PostInterface> implements PostInterface {
  public id: number;
  public userId: number;
  public text?: string;
  public createdAt: Date;
  public updatedAt: Date;

  static readonly CREATABLE = ['userId', 'text'];

  static readonly hooks: Partial<ModelHooks<PostModel>> = {
    async beforeCreate(record) {
    },

    async afterCreate(record) {
      console.log('Done post:', record);
    },
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
      through: 'PostHashtags',
      foreignKey: 'postId',
      as: 'hashtags',
    });
  }

  public static async createPost(userId: number, text: string, mediaBuffer?: Express.Multer.File) {
    const transaction = await PostModel.sequelize?.transaction();
    try {
      const post = await PostModel.create({ userId, text }, { transaction });

      if (mediaBuffer) {
        const buffer = mediaBuffer.buffer || fs.readFileSync(mediaBuffer.path);
        const fileNameSource = mediaBuffer.originalname || mediaBuffer.name;
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
        await MediaModel.create({ postId: post.id, userId, url, type: fileType }, { transaction });
      }

      const hashtags = text?.match(/#[\w]+/g) ?? [];
      const hashtagInstances = await Promise.all(
        hashtags.map(tag => HashtagModel.findOrCreate({
          where: { name: tag },
          defaults: { name: tag },
          transaction
        }))
      );

      const postHashtagsData = hashtagInstances.map(([hashtag]) => ({
        postId: post.id,
        hashtagId: hashtag.id,
      }));

      await PostHashtagsModel.bulkCreate(postHashtagsData, { transaction });

      await transaction?.commit();
      return post;
    } catch (error) {
      await transaction?.rollback();
      throw new Error(`Error creating post: ${error.message}`);
    }
  }
}

export default PostModel;