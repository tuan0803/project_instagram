import { Model, Sequelize} from 'sequelize';
import PostEntity from '@entities/posts';
import PostInterface from '@interfaces/posts';
import UserModel from './users';
import PostHashtagModel from './postHashtags';
import HashtagModel from './hashtags';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import PostTagUserModel from './postTagUsers';

class PostModel extends Model<PostInterface> implements PostInterface {
  public id: number;
  public userId: number;
  public text: string;
  public createdAt: Date;
  public updatedAt: Date;


  static readonly hooks: Partial<ModelHooks<PostModel>> = {
    async afterValidate(post, options) {
      const hashtags = post.text.match(/#(\w+)/g)?.map(tag => tag.substring(1)) || [];
      if (hashtags.length > 0) {
        const allHashtags = await Promise.all(
          hashtags.map(tag => HashtagModel.findOrCreate({ where: { name: tag } }))
        );
        post.setDataValue('hashtags', allHashtags.map(([hashtag]) => hashtag));
      }
    },
    async afterCreate(post, options) {
      const taggedUserIds = options.taggedUsers || [];
      if (taggedUserIds.length > 0) {
        const taggedUsers = taggedUserIds.map(userId => ({
          postId: post.id,
          userId
        }));
        await PostTagUserModel.bulkCreate(taggedUsers);
      }
    }           
  };

  public static initialize (sequelize: Sequelize) {
    this.init(PostEntity, {
      hooks: PostModel.hooks,
      tableName: 'posts',
      timestamps: true,
      sequelize,
    });
  }

  public static associate() {
    this.belongsToMany(HashtagModel, { through: PostHashtagModel, foreignKey: 'postId', otherKey: 'hashtagId', as: 'hashtags' });
    this.belongsToMany(UserModel, { through: PostTagUserModel, foreignKey: 'postId', otherKey: 'userId', as: 'taggedUsers' });
  }
}

export default PostModel;
