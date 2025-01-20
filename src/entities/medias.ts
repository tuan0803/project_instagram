import { DataTypes } from 'sequelize';

const MediaEntity = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'post_id',
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'url',
  },
  type: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'type',
  },
  timestamps: false,
};

export default MediaEntity;
