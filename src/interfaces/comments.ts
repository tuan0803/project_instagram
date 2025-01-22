interface CommentInterface {
    id: number;
    postId: number;
    userId: number;
    content: string;
    parentId?: number; // id nay se duoc chua o dau ?
    createdAt: Date;
}
interface CommentCreationAttributes extends Omit<CommentInterface, 'id' | 'createdAt'> { }

export { CommentCreationAttributes };
export default CommentInterface;
