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
    get (): number {
      return this.getDataValue('created_at') ? DateTimeUtil.dateToMs(this.getDataValue('created_at')) : null;
    },
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'updated_at',
    get (): number {
      return this.getDataValue('updated_at')
        ? DateTimeUtil.dateToMs(this.getDataValue('updated_at'))
        : null;
    },
  },
  commentCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'comment_count',
  },
  reactionCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'reaction_count',
  },
};
export default PostEntity;
