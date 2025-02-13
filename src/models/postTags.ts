import { Model, Sequelize } from 'sequelize';
import PostTagEntity from '@entities/postTags';
import PostInterface from '@interfaces/postTags';
import UserModel from '@models/users';
import PostModel from '@models/posts';

class PostTagModel extends Model<PostInterface> implements PostInterface {
    public id: number;
    public postId: number;
    public userId: number;

    public static initialize(sequelize: Sequelize) {
        this.init(PostTagEntity, {
            sequelize,
            tableName: 'post_tags',
            timestamps: false,
        });
    }

    public static associate() {
    }
}

export default PostTagModel;
