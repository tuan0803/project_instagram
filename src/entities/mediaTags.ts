import { DataTypes } from 'sequelize';

const MediaTagsEntity = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    mediaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'media_id',
        references: {
            model: 'medias',
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id',
        },
    },
    x: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'x',
    },
    y: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'y',
    },
};

export default MediaTagsEntity;