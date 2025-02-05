import { Model, Sequelize, ModelScopeOptions } from 'sequelize';
import ReactionEntity from '@entities/reactions';
import ReactionInterface, { ReactionCreationAttributes } from '@interfaces/reactions';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class ReactionModel extends Model<ReactionInterface, ReactionCreationAttributes> implements ReactionInterface {
  public id: number;
  public postId: number;
  public userId: number;
  public type?: string;
  public createdAt: Date;

  static readonly NOTIFIABLE_TYPE_ENUM = {
    SYSTEM: 'system',
  };

  static readonly hooks: Partial<ModelHooks<ReactionModel>> = {
    async beforeCreate(record) {
    },
    async afterCreate(record) {
      console.log('Done hashtag:', record);
    },
  };

  static readonly scopes: ModelScopeOptions = {
    byname(name) {
      return {
        where: { name: name },
      };
    },
  };

  public static initialize(sequelize: Sequelize) {
    this.init(ReactionEntity, {
      hooks: ReactionModel.hooks,
      tableName: 'reaction',
      sequelize,
      timestamps: false,
    });
  }

  public static associate() {
  }
}

export default ReactionModel;
