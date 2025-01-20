import { Model, Sequelize, ModelScopeOptions } from 'sequelize';
import HastagEntity from '@entities/hastags';
import HastagInterface, { HashtagCreationAttributes } from '@interfaces/hashtags';

class HastagModel extends Model<HastagInterface, HashtagCreationAttributes> implements HastagInterface {
    public id: number;
    public name: string;

    static readonly NOTIFIABLE_TYPE_ENUM = {
      SYSTEM: 'system',
    };

    static readonly scopes: ModelScopeOptions = {
      byname (name) {
        return {
          where: { name: name },
        };
      },
    };

    public static initialize (sequelize: Sequelize) {
      this.init(HastagEntity, {
        tableName: 'hastags',
        sequelize,
      });
    }

    public static associate () {
    }
}

export default HastagModel;
