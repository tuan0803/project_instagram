import { DataTypes } from 'sequelize';

const HastagEntity = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'name',
  },
};

export default HastagEntity;
