import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import TokenInterface from '@interfaces/tokens';
import TokenEntity from '@entities/tokens';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class TokenModel extends Model<TokenInterface> implements TokenInterface {
    public id: number;
    public userId: number;
    public accessToken: string;
    public refreshToken: string;
    public expiresAt: Date;
    public refreshExpiresAt: Date;
    public createdAt: Date;

    static readonly CREATABLE_PARAMETERS = ['userId', 'accessToken', 'refreshToken', 'expiresAt', 'refreshExpiresAt'];
    static readonly UPDATABLE_PARAMETERS = ['accessToken', 'refreshToken', 'expiresAt', 'refreshExpiresAt'];

    static readonly hooks: Partial<ModelHooks<TokenModel>> = {
        async beforeSave(token) {
            try {
                const existingTokens = await TokenModel.findAll({
                    where: { userId: token.userId },
                });
    
                if (existingTokens.length > 0) {
                    await TokenModel.destroy({
                        where: { userId: token.userId },
                    });
                }
            } catch (error) {
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
        byUserId(userId){
            return {
                where: { userId }
            }
        },
        byAccessToken (accessToken) {
            return {
                where: { accessToken }
            }
        },
        byRefreshToken (refreshToken) {
            return {
                where: { refreshToken }
            }
        }
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