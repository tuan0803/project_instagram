import { DataTypes } from 'sequelize';

const SearchHistoryEntity = {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    field: 'id',
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'type',
    defaultValue: 'user',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
  },
  query: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'query',
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

export default SearchHistoryEntity;
