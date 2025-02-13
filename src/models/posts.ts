import { Model, Sequelize} from 'sequelize';
import PostEntity from '@entities/posts';
import PostInterface from '@interfaces/posts';
import UserModel from './users';
import PostHashtagModel from './postHashtags';
import HashtagModel from './hashtags';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class PostModel extends Model<PostInterface> implements PostInterface {
  public id: number;
  public userId: number;
  public text: string;
  public createdAt: Date;
  public updatedAt: Date;
  public hashtags?: HashtagModel[];

  static readonly hooks: Partial<ModelHooks<PostModel>> = {
    async afterCreate(post) {
      const hashtags = post.text.match(/#(\w+)/g)?.map(tag => tag.substring(1)) || [];
  
      if (hashtags.length > 0) {
        const allHashtags = await Promise.all(
          hashtags.map(tag => HashtagModel.findOrCreate({ where: { name: tag } }))
        );
        await post.setHashtags(allHashtags.map(([hashtag]) => hashtag));
      }
    },
  };
  

  public static initialize (sequelize: Sequelize) {
    this.init(PostEntity, {
      hooks: PostModel.hooks,
      tableName: 'posts',
      timestamps: true,
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });
    this.belongsToMany(HashtagModel, {
      through: PostHashtagModel, 
      foreignKey: 'postId',
      otherKey: 'hashtagId',
      as: 'hashtags', 
    });    
  }
}

export default PostModel;
