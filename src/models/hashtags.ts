import { Model, Sequelize } from 'sequelize';
import HashtagsEntity from '@entities/hashtags';
import HashtagInterface from '@interfaces/hashtags';

class HashtagModel extends Model<HashtagInterface> implements HashtagInterface {
    public id: number;
    public name: string;

    public static initialize (sequelize: Sequelize) {
        this.init(HashtagsEntity, {
            sequelize,
            tableName: 'hashtags',
            timestamps: false,
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci"
        });
    };

    public static associate() {
        // // this.hasMany(PostHashtagModel, { foreignKey: 'hashtagId', as: 'postHashtags' });
        // HashtagModel.belongsToMany(PostModel, { through: PostHashtagModel, foreignKey: 'hashtagId', as: 'postHashtags' });
    }

}

export default HashtagModel;