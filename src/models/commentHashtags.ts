import { Model, DataTypes, Sequelize } from 'sequelize';
import commentHashtagEntity from '@entities/commentHashtags';
import HashtagModel from './hashtags';
import CommentModel from './comments';

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
        this.belongsTo(CommentModel, { foreignKey: 'commentId', as: 'comment' });
        this.belongsTo(HashtagModel, { foreignKey: 'hashtagId', as: 'hashtag' });
    }
}

export default CommentHashtagModel;
