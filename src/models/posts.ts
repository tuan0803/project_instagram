import { Model, Sequelize, ModelScopeOptions } from 'sequelize';
import PostEntity from '@entities/posts';
import PostInterface from '@interfaces/posts';
import PostTagModel from '@models/post_tags';
import UserModel from '@models/users';
import MediaModel from '@models/medias';
import HashtagModel from '@models/hashtags';
import HashtagInterface from '@interfaces/hashtags';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import { error } from 'node:console';
import PostTagInterface from '@interfaces/post_tags';

class PostModel extends Model<PostInterface> implements PostInterface {
  public id: number;
  public userId: number;
  public text?: string;
  public createdAt: Date;
  public updatedAt: Date;
  declare hashtagsList?: string[];
  declare taggedUserIds?: number[];

  static readonly CREATABLE = ['userId', 'text'];

  static readonly hooks: Partial<ModelHooks<PostModel>> = {
    async afterCreate(post) {
      await PostModel.processHashtags(post);
      await PostModel.processTaggedUsers(post);
    }
  };

  // Xử lý hashtags
  private static async processHashtags(post: PostModel) {
    try {
      if (!post.text) return;
      post.hashtagsList = post.text.match(/#[\w]+/g)?.map(tag => tag.toLowerCase()) ?? [];

      if (post.hashtagsList.length) {
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
      }
    } catch (error) {
      console.error('Lỗi xử lý hashtags :', error.message);
    }

  }

  // Xử lý gắn thẻ người dùng
  private static async processTaggedUsers(post: PostModel) {
    try {
      if (!post.text) return;
      const taggedUserIds = (post.text.match(/@(\d+)/g) || []).map(tag => Number(tag.replace('@', '')));

      if (taggedUserIds.length === 0) return;
      const users = await UserModel.findAll({ where: { id: taggedUserIds } });

      if (users.length !== taggedUserIds.length) {
        console.warn('Một số người dùng được tag không hợp lệ, bỏ qua.');
      }
      const validTags: Partial<PostTagInterface>[] = users.map(user => ({
        postId: post.id,
        userId: user.id,
      }));

      if (validTags.length) {
        await PostTagModel.bulkCreate(validTags);
      }
    } catch (error) {
      console.error('Lỗi xử lý gắn thẻ:', error.message);
    }
  }

  static readonly scopes: ModelScopeOptions = {
    byId(id) {
      return { where: { id } };
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
      through: 'post_hashtags', // bang trung gian
      foreignKey: 'id',
      as: 'hashtags',
      timestamps: false,
    });
    PostModel.belongsToMany(UserModel, {
      through: 'post_tags',
      foreignKey: 'postId',
      as: 'taggedUsers',
    });
  }
}

export default PostModel;