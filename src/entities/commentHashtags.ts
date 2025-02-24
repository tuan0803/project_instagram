import { DateTimeUtil } from '@libs/datetime';
import { DataTypes } from 'sequelize';

const commentHashtagEntity = {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    commentId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'comment_id',
    },
    hashtagId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'hashtag_id',
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

export default commentHashtagEntity;