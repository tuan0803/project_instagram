import { Model, DataTypes, Sequelize } from 'sequelize';
import CommentModel from './comments';
import HashtagEntity from '@entities/hashtags';

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
        this.hasMany(CommentModel, { foreignKey: 'id', as: 'comments' });
    }

}

export default HashtagModel;
