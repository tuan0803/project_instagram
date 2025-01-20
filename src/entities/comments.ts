import { DateTimeUtil } from '@libs/datetime';
import { DataTypes } from 'sequelize';

const commentEntity = {
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
  },
  content: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'content',
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'parent_id',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'created_at',
    get (): number {
      return this.getDataValue('created_at')
        ? DateTimeUtil.dateToMs(this.getDataValue('created_at'))
        : null;
    },
  },
  timestamps: false,
};

export default commentEntity;
