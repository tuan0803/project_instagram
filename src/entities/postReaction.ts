import { DateTimeUtil } from '@libs/datetime';
import { DataTypes } from 'sequelize';

const PostEntity = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'user_id',
  },
  text: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'text',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'updated_at',
  },
};
export default PostEntity;