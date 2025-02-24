import { DateTimeUtil } from '@libs/datetime';
import { DataTypes } from 'sequelize';

const ReactionEntity = {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    postId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'post_id',
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
        get(): number {
            return this.getDataValue('created_at')
                ? DateTimeUtil.dateToMs(this.getDataValue('created_at'))
                : null;
        },
    },
};

export default ReactionEntity;