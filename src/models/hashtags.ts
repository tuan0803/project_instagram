import { Model, DataTypes, Sequelize } from 'sequelize';
import HashtagEntity from '@entities/hashtags';
import CommentHashtagModel from './commentHashtags';
import CommentModel from './comments';
class HashtagModel extends Model {
    public id: number;
    public name: string;

    public static initialize(sequelize: Sequelize) {
        this.init(HashtagEntity, {
            sequelize,
            tableName: 'hashtags',
            timestamps: false,
        });
    }

    public static associate() {
        this.belongsToMany(CommentModel, { through: CommentHashtagModel, foreignKey: 'hashtagId', otherKey: 'commentId', as: 'comments' });
    }

}

export default HashtagModel;
