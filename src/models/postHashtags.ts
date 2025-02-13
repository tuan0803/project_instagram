import { Model, Sequelize } from 'sequelize';
import PostHashtagEntity from '@entities/postHashtags';
import PostHashtagInterface from '@interfaces/postHashtags';
import PostModel from './posts';
import HashtagModel from './hashtags';

class PostHashtagModel extends Model<PostHashtagInterface> implements PostHashtagInterface {
    public id: number;
    public postId: number;
    public hashtagId: number;

    public static initialize (sequelize: Sequelize) {
        this.init(PostHashtagEntity, {
            sequelize,
            tableName: 'post_hashtags',
            timestamps: false,
        });
    }

    public static associate () {
        this.belongsTo(PostModel, { foreignKey: 'postId', as: 'post' });
        this.belongsTo(HashtagModel, { foreignKey: 'hashtagId', as: 'hashtag' });
    }
}

export default PostHashtagModel;
