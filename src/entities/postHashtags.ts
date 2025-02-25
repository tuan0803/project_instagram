import { DataTypes } from 'sequelize';

const PostHashtagEntity = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  postId: {
    type: DataTypes.INTEGER,
    field: 'post_id',
    primaryKey: true,
    references: {
      model: "posts",
      key: "id",
      onDelete: "CASCADE"
    }
  },
  hashtagId: {
    type: DataTypes.INTEGER,
    field: 'hashtag_id',
    primaryKey: true,
    references: {
      model: "hashtags",
      key: "id",
      onDelete: "CASCADE"
    }
  },
};

export default PostHashtagEntity;
