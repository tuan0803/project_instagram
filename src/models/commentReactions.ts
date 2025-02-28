import { Model, Sequelize, ModelScopeOptions, ValidationError } from 'sequelize';
import CommentReactionEntity from '@entities/commentReaction';
import CommentReactionInterface from '@interfaces/commentReactions';
import CommentModel from './comments';
import UserModel from './users';

class CommentReactionsModel extends Model<CommentReactionInterface> implements CommentReactionInterface {
    public id: number;
    public commentId: number;
    public userId: number;
    public createdAt: Date;

    public static initialize(sequelize: Sequelize) {
        this.init(CommentReactionEntity, {
            tableName: 'comment_reactions',
            sequelize,
            timestamps: false,
            hooks: this.hooks,
        });
    }

    static readonly hooks = {
        async beforeValidate(like) {
            const comment = await CommentModel.findByPk(like.commentId);
            if (!comment) {
                throw new ValidationError('Bình luận không tồn tại.');
            }
            const existingLike = await CommentReactionsModel.findOne({
                where: { commentId: like.commentId, userId: like.userId },
            });
            if (existingLike) {
                throw new ValidationError('Người dùng đã thích bình luận này.');
            }
        },
    };

    static readonly scopes: ModelScopeOptions = {
        byId(id: number) {
            return { where: { id } };
        },
        byPost(commentId: number) {
            return { where: { commentId } };
        },
        byUser(userId: number) {
            return { where: { userId } };
        },
    };

    public static associate() {
        this.belongsTo(CommentModel, { foreignKey: 'commentId', as: 'commentreactions', onDelete: 'CASCADE' });
        this.belongsTo(UserModel, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
    }
}

export default CommentReactionsModel;