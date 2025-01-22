import TokenModel from "@models/tokens";
import dayjs from "dayjs";
import UserModel from "@models/users";
import { sendError } from "@libs/response"; 

class TokenService {
    public static async createTokens(userId: number, accessToken: string, refreshToken: string): Promise<any> {
        try {
            const expiresAt = dayjs().add(1, 'hour').toDate(); 
            const refreshExpiresAt = dayjs().add(7, 'days').toDate(); 
            const value = TokenModel.CREATABLE_PARAMETERS.reduce((acc: any, param: string) => {
                if (param === 'userId') acc[param] = userId;
                if (param === 'accessToken') acc[param] = accessToken;
                if (param === 'refreshToken') acc[param] = refreshToken;
                if (param === 'expiresAt') acc[param] = expiresAt;
                if (param === 'refreshExpiresAt') acc[param] = refreshExpiresAt;
                return acc;
            }, {});
            const token = await TokenModel.create(value);
        
            return token;
        } catch (error) {
            console.error('Error saving tokens:', error);
            return sendError(null, 500, 'Could not save tokens');
        }
    }
}

export default TokenService;
