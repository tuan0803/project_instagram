import { Model, Sequelize, ModelScopeOptions } from 'sequelize';
import HastagEntity from '@entities/hastags';
import HastagInterface from '@interfaces/hashtags';

class HastagModel extends Model<HastagInterface> implements HastagInterface {
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
  }
}

export default HastagModel;