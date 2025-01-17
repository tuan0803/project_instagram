import { DataTypes } from 'sequelize';

const TokenEntity = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    access_token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    refresh_expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
};

export default TokenEntity;
