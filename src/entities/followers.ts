import { DataTypes } from 'sequelize';

const FollowerEntity = {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    field: 'id',
  },
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'follower_id',
  },
  followeeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'followee_id',
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_approved',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
  },
};

export default FollowerEntity;