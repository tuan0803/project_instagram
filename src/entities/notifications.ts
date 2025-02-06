import { DateTimeUtil } from '@libs/datetime';
const { DataTypes } = require('sequelize');

const NotificationEntity = {
  id: {
    type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER, allowNull: true, field: 'user_id',
  },
  deviceToken: {
    type: DataTypes.VIRTUAL,
  },
  notifiableType: {
    type: DataTypes.STRING(255), allowNull: true, field: 'notifiable_type',
  },
  notifiableId: {
    type: DataTypes.INTEGER, allowNull: true, field: 'notifiable_id',
  },
  title: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  shortContent: {
    type: DataTypes.STRING(255), allowNull: true, field: 'short_content',
  },
  content: {
    type: DataTypes.TEXT, allowNull: false,
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'read_at',
    set (value: number | string) {
      if (!value) return;
      if (typeof value === 'string') value = parseInt(value);
      this.setDataValue('readAt', DateTimeUtil.msToTime(value));
    },
    get (): number {
      return this.getDataValue('readAt') ? DateTimeUtil.dateToMs(this.getDataValue('readAt')) : null;
    },
  },
  data: {
    type: DataTypes.TEXT,
    allowNull: true,
    set (value: any) {
      if (!value) return;
      this.setDataValue('data', JSON.stringify(value));
    },
    get (): any {
      if (!this.getDataValue('data')) return null;
      const data: any = JSON.parse(this.getDataValue('data'));
      return data;
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    get (): number {
      return this.getDataValue('createdAt') ? DateTimeUtil.dateToMs(this.getDataValue('createdAt')) : null;
    },
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
    get (): number {
      return this.getDataValue('updatedAt') ? DateTimeUtil.dateToMs(this.getDataValue('updatedAt')) : null;
    },
  },
  timestamps: false,

};

export default NotificationEntity;
