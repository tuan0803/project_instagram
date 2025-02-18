import { Model, DataTypes, Sequelize } from 'sequelize';
<<<<<<< HEAD
<<<<<<< HEAD
import HashtagEntity from '@entities/hashtags';
import CommentHashtagModel from './commentHastags';
import CommentModel from './comments';
=======
import CommentModel from './comments';
import HashtagEntity from '@entities/hashtags';

>>>>>>> 08f9925 (include)
=======
import HashtagEntity from '@entities/hashtags';
import CommentHashtagModel from './commentHastags';
import CommentModel from './comments';
>>>>>>> 1511fce (xong tag)
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
<<<<<<< HEAD
<<<<<<< HEAD
        this.belongsToMany(CommentModel, { through: CommentHashtagModel, foreignKey: 'hashtagId', otherKey: 'commentId', as: 'comments' });
=======
        this.hasMany(CommentModel, { foreignKey: 'id', as: 'comments' });
>>>>>>> 08f9925 (include)
=======
        this.belongsToMany(CommentModel, { through: CommentHashtagModel, foreignKey: 'hashtagId', otherKey: 'commentId', as: 'comments' });
>>>>>>> 1511fce (xong tag)
    }

}

export default HashtagModel;
