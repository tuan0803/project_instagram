import { Request, Response } from 'express';
import UserModel from '@models/users';
import { sendSuccess, sendError } from '@libs/response';
class ActiveController {
    public async create(req: Request, res: Response) {
        const { email, password } = req.fields;
        if (!email || !password) {
            return sendError(res, 400, 'Email and password are required');
        }
        try {
            const user = await UserModel.scope([{ method: ['byEmail', email] }]).findOne();

            if (!user || !(await user.validPassword(password))) {
                return sendError(res, 401, 'Invalid email or password');
            }
            if (!user.isActive) {
                await user.sendMailActive();
                return sendSuccess(res, { isSuccess: true });
            }
            return sendError(res, 400, { isSuccess: false });
        } catch (error) {
            sendError(res, 500, error.message, error);
        }
    }

    public async verify(req: Request, res: Response) {
        const { code } = req.query;
        if (!code) {
            return sendError(res, 400, 'Code is required');
        }
        try {
            const user = await UserModel.findOne({
                where: { verificationCode: code },
            });
    
            if (!user) {
                throw new Error('Invalid verification code.');
            }
    
            if (new Date() > user.verificationCodeExpiry) {
                throw new Error('Verification code expired.');
            }
    
            user.isActive = true;
            user.verificationCode = null;
            user.verificationCodeExpiry = new Date();
            await user.save();
            return sendSuccess(res, { isSuccess: true });
        } catch (error) {
            sendError(res, 500, error.message, error);
        }
    }

}
export default new ActiveController();