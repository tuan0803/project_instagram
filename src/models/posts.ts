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

    },

    async afterCreate(post) {
      if (post.text) {
        post.hashtagsList = post.text.match(/#[\w]+/g)?.map(tag => tag.toLowerCase()) ?? [];
        if (!post.hashtagsList?.length) return;

        try {
          const hashtagInstances = await Promise.all(
            post.hashtagsList.map(async (tag) => {
              const [hashtag] = await HashtagModel.findOrCreate({
                where: { name: tag },
                defaults: { name: tag } as Partial<HashtagInterface>,
              });
              return hashtag;
            })
          );

          await post.setHashtags(hashtagInstances);
        } catch (error) {
          console.error(`Error saving hashtags: ${error.message}`);
        }
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
}

export default PostModel;