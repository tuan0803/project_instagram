import { DateTimeUtil } from '@libs/datetime';
import { DataTypes } from 'sequelize';

const HashtagEntity = {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },

    name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'name',
    },
};

export default HashtagEntity;