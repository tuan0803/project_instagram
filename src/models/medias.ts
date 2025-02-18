import { Model, Sequelize } from 'sequelize';
import MediasEntity from '@entities/medias';
import MediaInterface from '@interfaces/medias';
import PostModel from './posts';
import MediaTagsModel from './mediaTags';


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
        this.hasMany(MediaTagsModel, { foreignKey: 'mediaId', as: 'mediaTags' });
    }
      
}
export default MediaModel;  