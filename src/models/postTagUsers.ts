import { Model, Sequelize } from 'sequelize';
import PostTagUserEntity from '@entities/postTagUsers';
import PostTagUserInterface from '@interfaces/postTagUsers';

class PostTagUserModel extends Model<PostTagUserInterface> implements PostTagUserInterface {
    public id: number;
    public postId: number;
    public userId: number;

    public static initialize (sequelize: Sequelize) {
        this.init(PostTagUserEntity, {
            sequelize,
            tableName: 'post_tags',
            timestamps: false,
        });
    }

    public static associate () {}
}

export default PostTagUserModel;
