import { Model, DataTypes, Sequelize } from 'sequelize';
import commentHashtagEntity from '@entities/commentHashtags';

class CommentHashtagModel extends Model {
    public id: number;
    public commentId: number;
    public hashtagId: number;
    public createdAt: Date;

    public static initialize(sequelize: Sequelize) {
        this.init(commentHashtagEntity, {
            sequelize,
            tableName: 'comment_hashtags',
            timestamps: false,
        });
    }
    public static associate() {
    }
}

export default CommentHashtagModel;
