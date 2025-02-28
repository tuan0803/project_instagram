import { DateTimeUtil } from '@libs/datetime';
import { DataTypes } from 'sequelize';

const commentTagEntity = {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    commentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'comment_id',
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'created_at',
    },
};

export default commentTagEntity;