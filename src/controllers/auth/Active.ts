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
            await user.sendMailActive();
            sendSuccess(res, { }, 'Gửi mã xác thực thành công.');
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
            await UserModel.activateAccount(code);
            sendSuccess(res, { }, 'Kích hoạt tài khoản thành công.');
        } catch (error) {
            sendError(res, 500, error.message, error);
        }
    }

}
export default new ActiveController();