import { DataTypes } from "sequelize";

const MediasEntity = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'post_id',
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'url',
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'type',
    },
};

export default MediasEntity;