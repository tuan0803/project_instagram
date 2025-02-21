import { Model, Sequelize } from 'sequelize';
import MediasEntity from '@entities/medias';
import MediaInterface from '@interfaces/medias';
import PostModel from './posts';
import MediaTagsModel from './mediaTags';
import UserModel from './users';


class MediaModel extends Model<MediaInterface> implements MediaInterface {
    public id: number;
    public postId: number;
    public type: string;
    public url: string;

    public static initialize (sequelize: Sequelize) {
        this.init(MediasEntity, {
            sequelize,
            tableName: 'medias',
            timestamps: false,
        });
    };

    public static associate() {
        this.belongsTo(PostModel, { foreignKey: 'postId', as: 'post' });
        MediaModel.belongsToMany(UserModel, { through: MediaTagsModel, as: 'taggedUsers', foreignKey: 'mediaId', otherKey: 'userId'});
    }
      
}
export default MediaModel;  