import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationError, ValidationErrorItem, Op } from 'sequelize';
import SearchHistoryEntity from '@entities/searchhistory';
import UserModel from '@models/users';

class SearchHistoryModel extends Model {
  public id!: number;
  public type!: string;
  public userId?: number;
  public query!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  static readonly CREATABLE_PARAMETERS = ['type', 'userId', 'query'];
  static readonly UPDATABLE_PARAMETERS = ['type', 'userId', 'query'];

  static readonly scopes: ModelScopeOptions = {
    byUser(userId: number) {
      return { where: { userId } };
    },
    byQuery(query: string) {
      return { where: { query: { [Op.like]: `%${query}%` } } };
    },
  };

  static readonly validations: ModelValidateOptions = {
    async isUserExist() {
      const user = await UserModel.findByPk(this.userId);
      if (!user) {
        throw new ValidationError('Validation Error', [
          new ValidationErrorItem('Người dùng không tồn tại!', 'Validation error', 'userId', this.userId),
        ]);
      }
    },
  };

  public static initialize(sequelize: Sequelize) {
    this.init(SearchHistoryEntity, {
      sequelize,
      tableName: 'search_history',
      modelName: 'searchHistory',
      scopes: SearchHistoryModel.scopes,
      validate: SearchHistoryModel.validations,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });
  }

  public static associate() {
    this.belongsTo(UserModel, { foreignKey: 'userId', as: 'userInfo' });
  }
}

export default SearchHistoryModel;
