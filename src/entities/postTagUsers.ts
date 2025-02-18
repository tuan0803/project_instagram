import { DataTypes } from 'sequelize';

const PostTagUserEntity = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  postId: {
    type: DataTypes.INTEGER,
    field: 'post_id',
    references: {
      model: "posts",
      key: "id"
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
    references: {
      model: "users",
      key: "id"
    }
  },
};

export default PostTagUserEntity;
