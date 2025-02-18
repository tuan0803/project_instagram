import { Model, Sequelize } from 'sequelize';
import PostHashtagEntity from '@entities/postHashtags';
import PostHashtagInterface from '@interfaces/postHashtags';
import HashtagModel from './hashtags';
import PostModel from './posts';


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
        this.belongsTo(HashtagModel, { foreignKey: 'hashtagId', as: 'hashtags' });
        this.belongsTo(PostModel, { foreignKey: 'postId', as: 'posts' });
    }
}

export default PostHashtagModel;
