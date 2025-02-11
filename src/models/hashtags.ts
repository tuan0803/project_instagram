import { Model, Sequelize, ModelScopeOptions } from 'sequelize';
import HastagEntity from '@entities/medias';
import HastagInterface from '@interfaces/hashtags';
import PostModel from './posts';

class HashtagModel extends Model<HastagInterface> implements HastagInterface {
  public id: number;
  public name: string;

  static readonly CREATABLE = ['name'];

  static readonly scopes: ModelScopeOptions = {
    byname(name) {
      return {
        where: { name: name },
      };
    },
  };

  public static initialize(sequelize: Sequelize) {
    this.init(HastagEntity, {
      tableName: 'hashtags',
      sequelize,
      timestamps: false,
    });
  }

  public static associate() {
    HashtagModel.belongsToMany(PostModel, {
      through: 'PostHashtagsModel',
      foreignKey: 'hashtagId',
      as: 'posts',
    });
  }
}

export default HashtagModel;