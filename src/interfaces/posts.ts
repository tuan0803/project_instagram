interface PostInterface {
  id: number;
  userId: number;
  text?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PostCreationAttributes extends Omit<PostInterface, 'id' | 'createdAt' | 'updatedAt'> { }

export { PostCreationAttributes };
export default PostInterface;