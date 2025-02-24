import { DateTimeUtil } from '@libs/datetime';
import { DataTypes } from 'sequelize';

const BannedHashtagEntity = {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    hashtag: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'hashtag',
        unique: true, 
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

export default BannedHashtagEntity;