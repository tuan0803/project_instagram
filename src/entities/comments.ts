import { DateTimeUtil } from '@libs/datetime';
import { DataTypes } from 'sequelize';

const commentEntity = {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'post_id',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
  },
  content: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'content',
    validate: {
      len: [1, 255] as [number, number],
    },
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'parent_id',
    validate: {
      isInt: true,
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'created_at',
  },
};

export default commentEntity;