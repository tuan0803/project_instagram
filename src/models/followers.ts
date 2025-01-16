import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import FollowerEntity from '@entities/followers';
import FollowerInterface from '@interfaces/followers';
// import { ModelHooks } from 'sequelize/types/lib/hooks';

class FollowerModel extends Model<FollowerInterface> implements FollowerInterface {
  public id: number;
  public followerId: number;
  public followeeId: number;
  public isApproved: boolean;
  public createdAt?: Date;

  // static readonly hooks: Partial<ModelHooks<FollowerModel>>
  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return {
        where: { id },
      };
    },
    byFollower (followerId) {
      return {
        where: { followerId },
      };
    },
    byFollowee (followeeId) {
      return {
        where: { followeeId },
      };
    },
    isApproved () {
      return {
        where: { isApproved: true },
      };
    },
    byFollowerAndFollowee (followerId: number, followeeId: number) {
      return {
        where: {
          followerId,
          followeeId,
        },
      };
    },
  };

  public static initialize (sequelize: Sequelize) {
    this.init(FollowerEntity, {
      // hooks: FollowerModel.hooks,
      scopes: FollowerModel.scopes,
      tableName: 'followers',
      sequelize,
    });
  }

  public static associate () {

  }
}

export default FollowerModel;
