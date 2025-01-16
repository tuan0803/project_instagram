interface PostInterface {
  id: number;
  userId: number;
  text?: string;
  createdAt: Date;
  updatedAt: Date;
  commentCount?: number;
  reactionCount?: number;
}

export default PostInterface;
