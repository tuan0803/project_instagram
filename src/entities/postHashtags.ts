const { DataTypes } = require('sequelize');

const PostHashtagsEntity = {
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
  hashtagId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'hashtag_id',
  },

};
export default PostHashtagsEntity;
