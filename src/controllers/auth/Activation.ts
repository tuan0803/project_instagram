import { Request, Response } from 'express';
import UserModel from '@models/users';
import { sendSuccess, sendError } from '@libs/response';
import { NoData, InternalError } from '@libs/errors';

class ActiveController {
    public async create(req: Request, res: Response) {
        const { id } = req.body;
        
        try {
            const user = await UserModel.findByPk(id);

            if (!user || user.isActive) {
                return sendError(res, 404, NoData);
            }
            await user.sendMailActive();
            return sendSuccess(res, { isSuccess: true });
        } catch (error) {
            sendError(res, 500, InternalError, error);
        }
    }

    public async verify(req: Request, res: Response) {
        const { code } = req.query;
        try {
            const user = await UserModel.scope([{ method: ['byVerificationCode', code ] }]).findOne();
    
            if (!user) {
                return sendError(res, 404, NoData);
            }
    
            user.isActive = true;
            user.verificationCode = null;
            user.verificationCodeExpiry = null;
            await user.save();
            return sendSuccess(res, { isSuccess: true });
        } catch (error) {
            sendError(res, 500, InternalError, error);
        }
    }
}

export default new ActiveController();
