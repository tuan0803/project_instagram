import { DataTypes } from 'sequelize';

const MediaTagEntity = {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
    },
    mediaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'media_id',
    }, 
    xCoordinate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'x_coordinate',
    }, 
    yCoordinate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'y_coordinate',
    },
};

export default MediaTagEntity;