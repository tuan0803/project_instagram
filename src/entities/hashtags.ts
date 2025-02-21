import { DataTypes } from 'sequelize';

const HashtagsEntity = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

export default HashtagsEntity;
