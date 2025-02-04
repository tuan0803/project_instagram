
import { Request, Response } from 'express';
import UserModel from '@models/users';
import { sendSuccess, sendError } from '@libs/response';
import { BadAuthentication, InternalError } from '@libs/errors';
    
class LoginController {
    public async login(req: Request, res: Response) {
        const { email, password } = req.fields;
        
        try {
            const user = await UserModel.scope([{ method: ['byEmail', email] }]).findOne();
    
            if (!user || !(await user.validPassword(password))) {
                return sendError(res, 401, BadAuthentication);
            }
            let accessToken = null;
            let refreshToken = null;
            if (user.isActive) {
                const tokens = await user.generateToken();
                accessToken = tokens.accessToken;
                refreshToken = tokens.refreshToken;
            }
            return sendSuccess(res, {
                isSuccess: true,
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                     isActive: user.isActive,
                },  
            });
        } catch (error: any) {
            console.error('Login Error:', error);
            sendError(res, 500, InternalError, error);
        }
    }
}

export default new LoginController();