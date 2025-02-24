import { Model, ModelScopeOptions, Sequelize} from 'sequelize';
import PostEntity from '@entities/posts';
import PostInterface from '@interfaces/posts';
import UserModel from './users';
import PostHashtagModel from './postHashtags';
import HashtagModel from './hashtags';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import PostTagUserModel from './postTagUsers';
import MediaModel from './medias';
import MediaTagsModel from './mediaTags';

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
      if (taggedUsers.length > 0) {
        const users = await UserModel.findAll({
          where: { id: taggedUsers },
          attributes: ['id']
        });
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
    },
    async beforeUpdate(post, options) {
      if (post.changed('text')) {
        const hashtags = post.getDataValue('hashtags') || [];
        await post.setHashtags(hashtags);
        const users = post.getDataValue('users') || [];
        await post.setUsers(users);
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
    },
    withComponents() { 
      return {
        include: [
          {
            model: UserModel,
            as: 'author', 
            attributes: [['id', 'authorId'], 'name'],
          },
          { 
            model: UserModel, 
            as: 'users', 
            attributes: [['id', 'taggedUserId'], 'name'],
            through: { attributes: [] },
          },
          { 
            model: HashtagModel,
            as: 'hashtags', 
            attributes: [['id', 'hashtagId'], 'name'],
            through: { attributes: [] },
          },
          { 
            model: MediaModel, 
            as: 'media', 
            attributes: [['id', 'mediaId'], 'url', 'type'],
            include: [
              { 
                model: MediaTagsModel, 
                as: 'mediaTags', 
                attributes: [['id', 'mediaTagId'], 'x', 'y'],
                include: [
                  { 
                    model: UserModel,
                    as: 'user', 
                    attributes: [['id', 'userId'], 'name']
                  }
                ]
              }
            ]
          },
        ],
      };
    },
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
