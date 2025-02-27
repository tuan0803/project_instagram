interface CommentReactionInterface {
    id: number;
    commentId: number;
    userId: number;
    createdAt?: Date;
};

export default CommentReactionInterface;