import { DataTypes } from "sequelize";

const MediasEntity = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    postId: {
        type: DataTypes.INTEGER,
        field: 'post_id',
        references: {
            model: "posts",
            key: "id",
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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