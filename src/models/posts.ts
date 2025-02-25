import { Model, ModelScopeOptions, Sequelize} from 'sequelize';
import PostEntity from '@entities/posts';
import PostInterface from '@interfaces/posts';
import UserModel from './users';
import PostHashtagModel from './postHashtags';
import HashtagModel from './hashtags';
import { ModelHooks } from 'sequelize/types/hooks';

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
  }
}

export default PostModel;
