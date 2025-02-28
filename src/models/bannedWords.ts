import BannedWordsEntity from "@entities/bannedWords";
import BannedWordsInterface from "@interfaces/bannedWords";
import { Model, Sequelize, ModelScopeOptions, ValidationError } from 'sequelize';
import { ModelHooks } from "sequelize/types/lib/hooks";

class BannedWordModel extends Model<BannedWordsInterface> implements BannedWordsInterface {
    public id: number;
    public words: string;
    public createdAt: Date;

    public static initialize(sequelize: Sequelize) {
        this.init(BannedWordsEntity, {
            tableName: 'banned_words',
            sequelize,
            timestamps: false,
            hooks: this.hooks,
        });
    };

    static readonly hooks: Partial<ModelHooks<BannedWordModel>> = {
        async beforeValidate(bannedwords, _options) {
        },
    };

    public static associate() {
    }
}

export default BannedWordModel;