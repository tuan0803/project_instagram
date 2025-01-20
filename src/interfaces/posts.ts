interface PostInterface {
  id: number;
  userId: number;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
  commentCount: number;
  reactionCount: number;
}

interface PostCreationAttributes extends Omit<PostInterface, 'id' > { }

export { PostCreationAttributes };
export default PostInterface;
