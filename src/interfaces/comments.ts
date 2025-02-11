interface CommentInterface {
    id: number;
    postId: number;
    userId: number;
    content: string;
    parentId?: number; 
    createdAt: Date;
}

export default CommentInterface;