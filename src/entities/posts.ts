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
    allowNull: false,
    field: 'user_id',
    references: {
      model: "users",
      key: "id"
    }
  },
  text: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'text',
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
  },
};
export default PostEntity;
