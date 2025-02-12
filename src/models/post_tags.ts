import { Model, Sequelize } from 'sequelize';
import PostTagEntity from '@entities/post_tags';
import PostInterface from '@interfaces/post_tags';
import UserModel from '@models/users';
import PostModel from '@models/posts';

class PostTagModel extends Model<PostInterface> implements PostInterface {
    public id: number;
    public postId: number;
    public userId: number;

    public static initialize(sequelize: Sequelize) {
        this.init(PostTagEntity, {
            sequelize,
            tableName: 'post_tag',
            timestamps: false,
        });
    }

    public static associate() {
        this.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });
        this.belongsTo(PostModel, { foreignKey: 'postId', as: 'post' });
    }
}

export default PostTagModel;
