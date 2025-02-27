import { Model, Sequelize } from 'sequelize';
import PostTagUserEntity from '@entities/postTagUsers';
import PostTagUserInterface from '@interfaces/postTagUsers';
import PostModel from './posts';
import UserModel from './users';

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

    public static associate () {
        this.belongsTo(PostModel, { foreignKey: 'postId', as: 'post', onDelete: 'CASCADE' });
        this.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });
    }
}

export default PostTagUserModel;
