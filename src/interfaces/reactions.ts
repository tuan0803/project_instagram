interface ReactionInterface {
    id: number;
    postId: number;
    userId: number;
    type: string;
    createdAt?: Date;
}
interface ReactionCreationAttributes extends Omit<ReactionInterface, 'id'> { }

export { ReactionCreationAttributes };
export default ReactionInterface;
