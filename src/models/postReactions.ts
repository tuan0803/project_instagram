import { Model, Sequelize, ModelScopeOptions, ValidationError } from 'sequelize';
import ReactionEntity from '@entities/postReaction';
import ReactionInterface from '@interfaces/postReactions';
import PostModel from './posts';
import UserModel from './users';

class ReactionsModel extends Model<ReactionInterface> implements ReactionInterface {
    public id: number;
    public postId: number;
    public userId: number;
    public createdAt: Date;

    public static initialize(sequelize: Sequelize) {
        this.init(ReactionEntity, {
            tableName: 'post_reactions',
            sequelize,
            timestamps: false,
            hooks: this.hooks,
        });
    }

    static readonly hooks = {
        async beforeValidate(like) {
            const post = await PostModel.findByPk(like.postId);
            if (!post) {
                throw new ValidationError('Bài viết không tồn tại.');
            }
            const existingLike = await ReactionsModel.findOne({
                where: { postId: like.postId, userId: like.userId },
            });
            if (existingLike) {
                throw new ValidationError('Người dùng đã thích bài viết này.');
            }
        },
    };

    static readonly scopes: ModelScopeOptions = {
        byId(id: number) {
            return { where: { id } };
        },
        byPost(postId: number) {
            return { where: { postId } };
        },
        byUser(userId: number) {
            return { where: { userId } };
        },
    };

    public static associate() {
        this.belongsTo(PostModel, { foreignKey: 'postId', as: 'post', onDelete: 'CASCADE' });
        this.belongsTo(UserModel, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
    }
}

export default ReactionsModel;