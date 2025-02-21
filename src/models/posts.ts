import { Model, ModelScopeOptions, Sequelize} from 'sequelize';
import PostEntity from '@entities/posts';
import PostInterface from '@interfaces/posts';
import UserModel from './users';
import PostHashtagModel from './postHashtags';
import HashtagModel from './hashtags';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import PostTagUserModel from './postTagUsers';
import MediaModel from './medias';

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
    
      const hashtagList = hashtags ? hashtags.map(tag => tag.substring(1)) : [];
      const taggedUsers = taggedUserIds ? taggedUserIds.map(tag => tag.slice(1)) : [];
      if (hashtagList.length > 0) {
        const allHashtags = await Promise.all(
          hashtagList.map(tag => HashtagModel.findOrCreate({ where: { name: tag } }))
        );
        post.setDataValue('hashtags', allHashtags.map(([hashtag]) => hashtag));
      }
      if (taggedUsers.length > 0) {
        const users = await UserModel.findAll({
          where: { id: taggedUsers },
          attributes: ['id']
        });
        const validUsers = users.filter(user => user !== null);
        if (validUsers.length > 0) {
          post.setDataValue('users', validUsers);
        }
      }
    },
    async beforeUpdate(post, options) {

      const hashtags = post.text.match(/#(\w+)/g);
      const taggedUserIds = post.text.match(/@(\d+)/g);
    
      const hashtagList = hashtags ? hashtags.map(tag => tag.substring(1)) : [];
      const taggedUsers = taggedUserIds.map(tag => tag.slice(1));

      if (hashtagList.length > 0) {
        const allHashtags = await Promise.all(
          hashtagList.map(tag => HashtagModel.findOrCreate({ where: { name: tag } }))
        );
        post.setHashtags(allHashtags.map(([hashtag]) => hashtag))
      }

      if (taggedUsers.length > 0) {
        const users = await UserModel.findAll({
          where: { id: taggedUsers },
          attributes: ['id']
        });

        if (users.length > 0) {
          const userIds = users.map(user => user.id);
          await post.setUsers(userIds);
        }
      }        
    },    
  };

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return {
        where:{ id }
      }
    },
    byUser (userId) {
      return {
        where: { userId }
      }
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

  public static associate() {
    PostModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'author' });
    PostModel.belongsToMany(HashtagModel, { through: PostHashtagModel, foreignKey: 'postId', as: 'hashtags' });
    PostModel.hasMany(MediaModel, { foreignKey: 'postId', as: 'media', onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true });
    PostModel.belongsToMany(UserModel, { through: PostTagUserModel, foreignKey: 'postId', otherKey: 'userId', as: 'users' });
  }
}

export default PostModel;
