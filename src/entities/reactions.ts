import { DateTimeUtil } from '@libs/datetime';
import { DataTypes } from 'sequelize';

const ReactionEntity = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'post_id',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'user_id',
  },
  type: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'type',
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
export default ReactionEntity;
