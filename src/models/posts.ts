import { Model, ModelScopeOptions, Sequelize} from 'sequelize';
import PostEntity from '@entities/posts';
import PostInterface from '@interfaces/posts';
import UserModel from './users';
import PostHashtagModel from './postHashtags';
import HashtagModel from './hashtags';
import { ModelHooks } from 'sequelize/types/hooks';
import PostTagUserModel from './postTagUsers';

class PostModel extends Model<PostInterface> implements PostInterface {
  public id: number;
  public userId: number;
  public text: string;
  public createdAt: Date;
  public updatedAt: Date;

  static readonly hooks: Partial<ModelHooks<PostModel>> = {
    async afterValidate(post, options) {
      if (!post.text) return;
      const hashtags = post.text.match(/#(\w+)/g);
      const taggedUserIds = post.text.match(/@(\d+)/g);
      const userIds = taggedUserIds ? taggedUserIds.map(tag => tag.substring(1)): [];
      const hashtagNames = hashtags ? hashtags.map(tag => tag.substring(1).toLowerCase()): [];
      if (hashtagNames.length > 0) {
        const allHashtags = await Promise.all(
          hashtagNames.map(tag => HashtagModel.findOrCreate({ where: { name: tag } }))
        );
        const hashtagsWithId = allHashtags.map(([hashtag]) => hashtag);
        post.setDataValue('hashtags', hashtagsWithId);
        let updatedText = post.text;
        hashtagsWithId.forEach(({ name, id }) => {
          const regex = new RegExp(`#${name}\\b`, 'gi');
          updatedText = updatedText.replace(regex, `#{{${id}}}`);
        });
        post.text = updatedText;
      } else {
        post.setDataValue('hashtags', []);
      }

      if (userIds.length > 0) {
        const users = await UserModel.findAll({ where: { id: userIds }, attributes: ['id'] });
        post.setDataValue('users', users);
        let updatedText = post.text;
        users.forEach(({ id }) => {
          const regex = new RegExp(`@${id}\\b`, 'gi');
          updatedText = updatedText.replace(regex, `@{{${id}}}`);
        });
        post.text = updatedText;
      } else {
        post.setDataValue('users', []);
      }
    }
  };

  static readonly scopes: ModelScopeOptions = {
    byId(id: number) {
      return { where: { id } };
    },
    byUser(userId: number) {
      return { where: { userId } };
    }
  };   

  public static initialize (sequelize: Sequelize) {
    this.init(PostEntity, {
      hooks: PostModel.hooks,
      scopes: PostModel.scopes,
      tableName: 'posts',
      timestamps: true,
      sequelize,
    });
  }

  public static associate () {
    PostModel.belongsToMany(HashtagModel, { through: PostHashtagModel, foreignKey: 'postId', as: 'hashtags', onDelete: 'CASCADE' });
    PostModel.belongsToMany(UserModel, { through: PostTagUserModel, foreignKey: 'postId', otherKey: 'userId', as: 'users', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  }
}

export default PostModel;
