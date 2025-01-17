import { Request, Response } from 'express';
import UserModel from '@models/users';
import { sendSuccess, sendError } from '@libs/response';
import TokenService from '@services/tokenService';

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
        const email = req.fields?.email;
        const password = req.fields?.password;
        if (!email || !password) {
            return sendError(res, 400, 'Email and password are required');
        }

        try {
            const user = await UserModel.scope([{ method: ['byEmail', email] }]).findOne();

            if (!user || !(await user.validPassword(password))) {
                return sendError(res, 401, 'Invalid email or password');
            }

            const tokens = UserModel.generate(user);
            await TokenService.createTokens(user.id, tokens.accessToken, tokens.refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true });
            return sendSuccess(res, { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
        } catch (error: any) {
            console.error('Login Error:', error);
            sendError(res, 500, error.message || 'Internal Server Error', error);
        }
    }
}

export default new LoginController();
