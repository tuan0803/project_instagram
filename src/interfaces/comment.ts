export interface CommentAttributes {
  id: number;
  postId: number;
  userId: number;
  content: string;
  parentId?: number | null;
  createdAt?: Date;
}

export interface CommentCreationAttributes extends Partial<Omit<CommentAttributes, 'id'>> {}
