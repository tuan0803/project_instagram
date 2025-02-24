import { Model, Sequelize } from 'sequelize';
import MediaTagInterface from '@interfaces/mediaTags';
import MediaTagEntity from '@entities/mediaTags';
import MediaModel from './medias';
import UserModel from './users';

class MediaTagsModel extends Model<MediaTagInterface> implements MediaTagInterface {
    public id: number;
    public mediaId: number;
    public userId: number;
    public x: number;
    public y: number;

    public static initialize (sequelize: Sequelize) {
        this.init(MediaTagEntity, {
            sequelize,
            tableName: 'media_tags',
            timestamps: false,
        });
    };

    public static associate() {
        this.belongsTo(MediaModel, { foreignKey: 'mediaId', as: 'media' });
        this.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });
    }
}

export default MediaTagsModel;