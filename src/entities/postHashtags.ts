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
    references: {
      model: "posts",
      key: "id"
    }
  },
  hashtagId: {
    type: DataTypes.INTEGER,
    field: 'hashtag_id',
    references: {
      model: "hashtags",
      key: "id"
    }
  },
};

export default PostHashtagEntity;
