import { Request, Response } from 'express';
import UserModel from '@models/users';
import { sendSuccess, sendError } from '@libs/response';
class ActiveController {
    public async create(req: Request, res: Response) {
        const { id } = req.fields;
        
        try {
            const user = await UserModel.findByPk(id);

            if (!user || user.isActive) {
                return sendError(res, 404, { isSuccess: false });
            }
            await user.sendMailActive();
            return sendSuccess(res, { isSuccess: true });
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
            const user = await UserModel.scope([{ method: ['byVerificationCode', code ] }]).findOne();
    
            if (!user) {
                return sendError(res, 404, 'User not found');
            }
    
            if (new Date() > user.verificationCodeExpiry) {
                return sendError(res, 400, 'Code has expired');
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