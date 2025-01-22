
import { Request, Response } from 'express';
import UserModel from '@models/users';
import { sendSuccess, sendError } from '@libs/response';
import TokenService from '@services/token.service';
    
class LoginController {
    // private createTokens = (user: any) => {
    //     const accessToken = jwt.sign(
    //         { userId: user.id },
    //         Settings.jwtSecret,
    //         { expiresIn: '1h' }
    //     );

    //     const refreshToken = jwt.sign(
    //         { userId: user.id },
    //         Settings.jwtRefreshSecret,
    //         { expiresIn: '7d' }
    //     );

    //     return { accessToken, refreshToken };
    // };

    public async login(req: Request, res: Response) {
        if (!req.fields || !req.fields.email || !req.fields.password) {
            return sendError(res, 400, 'Email and password are required');
        }
        const { email, password } = req.fields;
        
        try {
            const user = await UserModel.scope([{ method: ['byEmail', email] }]).findOne();
    
            if (!user || !(await user.validPassword(password))) {
                return sendError(res, 401, 'Invalid email or password');
            }
    
            if (!user.isActive) {
                return sendSuccess(res, {
                    isSuccess: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        isActive: user.isActive,
                    },
                    message: 'Account is not activated. Please verify your email.',
                });
            }
    
            const tokens = await user.generateToken();
            await TokenService.createTokens(user.id, tokens.accessToken, tokens.refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true});
    
            return sendSuccess(res, {
                isSuccess: true,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    isActive: user.isActive,
                },
            });
        } catch (error: any) {
            console.error('Login Error:', error);
            sendError(res, 500, 'Internal Server Error', { message: error.message });

        }
    }
    
}

export default new LoginController();