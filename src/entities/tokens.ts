import { DataTypes } from 'sequelize';

const TokenEntity = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
    },
    accessToken: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        field: 'access_token',
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        field: 'refresh_token',
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at',
    },
    refreshExpiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'refresh_expires_at',
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
    },
    
    
};

export default TokenEntity;
