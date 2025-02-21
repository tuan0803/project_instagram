import { Model, Sequelize } from 'sequelize';
import HashtagsEntity from '@entities/hashtags';
import HashtagInterface from '@interfaces/hashtags';
import PostHashtagModel from './postHashtags';
import PostModel from './posts';

class HashtagModel extends Model<HashtagInterface> implements HashtagInterface {
    public id: number;
    public name: string;

    public static initialize (sequelize: Sequelize) {
        this.init(HashtagsEntity, {
            sequelize,
            tableName: 'hashtags',
            timestamps: false,
        });
    };

    public static associate() {
        HashtagModel.belongsToMany(PostModel, { through: PostHashtagModel, foreignKey: 'hashtagId', as: 'postHashtags' });
    }
      
}

export default HashtagModel;
