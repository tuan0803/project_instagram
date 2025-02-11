import { DataTypes } from 'sequelize';

const PostCommentCountEntity = {
  postId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    unique: true,
    references: { model: 'posts', key: 'id' },
    onDelete: 'CASCADE',
  },
  commentCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
};

export default PostCommentCountEntity;