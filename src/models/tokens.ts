import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import TokenEntity from '@entities/token';
import TokenInterface from '@interfaces/tokens';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class TokenModel extends Model<TokenInterface> implements TokenInterface {
    public id: number;
    public user_id: number;
    public access_token: string;
    public refresh_token: string;
    public expires_at: Date;
    public refresh_expires_at: Date;
    public created_at: Date;

    static readonly CREATABLE_PARAMETERS = ['user_id', 'access_token', 'refresh_token', 'expires_at', 'refresh_expires_at'];
    static readonly UPDATABLE_PARAMETERS = ['access_token', 'refresh_token', 'expires_at', 'refresh_expires_at'];

    static readonly hooks: Partial<ModelHooks<TokenModel>> = {
        async beforeSave(token) {
            try {
                const existingTokens = await TokenModel.findAll({
                    where: { user_id: token.user_id },
                });
    
                if (existingTokens.length > 0) {
                    await TokenModel.destroy({
                        where: { user_id: token.user_id },
                    });
                }
            } catch (error) {
                console.error('Error removing old tokens:', error);
                throw new Error('Could not remove old tokens');
            }
        },  
    };

    static readonly scopes: ModelScopeOptions = {
        byId (id) {
            return {
                where: { id }
            }
        },
        byUserId(user_id){
            return {
                where: { user_id }
            }
        },
        byAccessToken (access_token) {
            return {
                where: { access_token }
            }
        },
        byRefreshToken (refresh_token) {
            return {
                where: { refresh_token }
            }
        }
    }


    
    public static async checkAccessToken( access_token: string) {
        return await TokenModel.findOne({
            where: { access_token }
        });
    }

    public static async checkRefreshToken( refresh_token: string) {
        return await TokenModel.findOne({
            where: { refresh_token }
        });
    }

    public static initialize  (sequelize : Sequelize)  {
        this.init( TokenEntity, {
            scopes: TokenModel.scopes,
            hooks: TokenModel.hooks,
            sequelize,
            modelName: 'Token',
            tableName: 'tokens',
            timestamps: false,
            createdAt: 'created_at',
        });
    }

    public static associate() {
    }
}

export default TokenModel;