import BannedHashtagEntity from "@entities/banned_hashtags";
import BannerHashtagInterface from "@interfaces/bannedHashtags";
import { Model, Sequelize, ModelScopeOptions, ValidationError } from 'sequelize';
import { ModelHooks } from "sequelize/types/lib/hooks";

class BannedHashtagModel extends Model<BannerHashtagInterface> implements BannerHashtagInterface {
    public id: number;
    public hashtag: string;
    public createdAt: Date;

    public static initialize(sequelize: Sequelize) {
        this.init(BannedHashtagEntity, {
            tableName: 'banned_hashtags',
            sequelize,
            timestamps: false,
            hooks: this.hooks,
        });
    };

    static readonly hooks: Partial<ModelHooks<BannedHashtagModel>> = {
        async beforeValidate(bannedHashtag, _options) {
        },
    };

    public static associate() {
    }
}

export default BannedHashtagModel;
