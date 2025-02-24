import { Model, Sequelize } from 'sequelize';
import PostHashtagEntity from '@entities/postHashtags';
import PostHashtagInterface from '@interfaces/postHashtags';


class PostHashtagModel extends Model<PostHashtagInterface> implements PostHashtagInterface {
    public id: number;
    public postId: number;
    public hashtagId: number;

    public static initialize (sequelize: Sequelize) {
        this.init(PostHashtagEntity, {
            sequelize,
            tableName: 'post_hashtags',
            timestamps: false,
            modelName: 'PostHashtagModel',
        });
    }
    
    public static associate () {
    }
}

export default PostHashtagModel;
