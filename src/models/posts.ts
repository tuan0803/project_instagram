import { Model, Sequelize, ModelScopeOptions } from 'sequelize';
import PostEntity from '@entities/posts';
import PostInterface from '@interfaces/posts';
import UserModel from '@models/users';
import MediaModel from '@models/medias';
import HashtagModel from '@models/hashtags';
import HashtagInterface from '@interfaces/hashtags';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class PostModel extends Model<PostInterface> implements PostInterface {
  public id!: number;
  public userId!: number;
  public text?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  declare hashtagsList?: string[];
  declare taggedUserIds?: number[];

  static readonly CREATABLE = ['userId', 'text'];

  static readonly hooks: Partial<ModelHooks<PostModel>> = {
    async beforeCreate(post) {
      PostModel.extractHashtags(post);
      PostModel.extractTaggedUsers(post);
    }
  };

  public static extractHashtags(text: string | undefined): string[] {
    if (typeof text !== "string") return [];
    return text.match(/#[\w]+/g)?.map(tag => tag.toLowerCase()) ?? [];
  }
  public static extractTaggedUsers(text: string | undefined): number[] {
    if (typeof text !== "string") return [];
    return text.match(/@(\d+)/g)?.map(tag => Number(tag.replace("@", ""))) ?? [];
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
    PostModel.belongsToMany(HashtagModel, {
      through: 'post_hashtags',
      foreignKey: 'post_id',
      otherKey: 'hashtag_id',
      as: 'hashtags',
      timestamps: false,
    });

    PostModel.belongsToMany(UserModel, {
      through: 'post_tags',
      foreignKey: 'post_id',
      otherKey: 'user_id',
      as: 'taggedUsers',
      timestamps: false,
    });
  }

}

export default PostModel;
