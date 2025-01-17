import TokenModel from "@models/tokens";
import dayjs from "dayjs";
import UserModel from "@models/users";


class TokenService {
    public static async createTokens(userId: number, accessToken: string, refreshToken: string): Promise<any> {
        try {
            const expiresAt = dayjs().add(1, 'hour').toDate(); 
            const refreshExpiresAt = dayjs().add(7, 'days').toDate(); 
            const value = TokenModel.CREATABLE_PARAMETERS.reduce((acc: any, param: string) => {
                if (param === 'user_id') acc[param] = userId;
                if (param === 'access_token') acc[param] = accessToken;
                if (param === 'refresh_token') acc[param] = refreshToken;
                if (param === 'expires_at') acc[param] = expiresAt;
                if (param === 'refresh_expires_at') acc[param] = refreshExpiresAt;
                return acc;
            }, {});
            const token = await TokenModel.create(value);
        
            return token;
        } catch (error) {
            console.error('Error saving tokens:', error);
            throw new Error('Could not save tokens');
        }
    }

    public static async checkToken(access_token: string, refresh_token: string): Promise<any> {
        try {
            const AccessToken = await TokenModel.checkAccessToken(access_token);
           
            if (!AccessToken) {
                throw new Error('Invalid access token');
            }
            const isAccessTokenExpired = dayjs().isAfter(dayjs(AccessToken.expires_at));
            
            if (isAccessTokenExpired) {
                const refreshToken = await TokenModel.checkRefreshToken(refresh_token);
                
                if (!refreshToken) {
                    throw new Error('Invalid refresh token');
                }
    
                const isRefreshTokenExpired = dayjs().isAfter(dayjs(refreshToken.refresh_expires_at));
                if (isRefreshTokenExpired) {
                    throw new Error('Refresh token expired, please log in again');
                }
    
                const user = await UserModel.findById(AccessToken.user_id);
                const newTokens = await UserModel.generate(user);
    
                await AccessToken.update({
                    access_token: newTokens.accessToken,
                    refresh_token: newTokens.refreshToken,
                    expires_at: dayjs().add(1, 'hour').toDate(),  
                    refresh_expires_at: refreshToken.refresh_expires_at, 
                });
    
                return { accessToken: newTokens.accessToken };
            }
    
            return { accessToken: AccessToken.access_token };
    
        } catch (error) {
            console.error('Error checking token:', error);
            throw new Error('Could not check token');
        }
    }
    

}

export default TokenService;