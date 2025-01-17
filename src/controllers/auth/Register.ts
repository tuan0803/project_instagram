import { Request, Response } from 'express';
import UserModel from '@models/users';
import { sendSuccess, sendError } from '@libs/response';

class registerController {
    public async register(req: Request, res: Response) {
        try {
            const value = req.parameters.permit(UserModel.CREATABLE_PARAMETERS).value();
            const newUser = await UserModel.create(value);
            sendSuccess(res, { item: newUser }, 'Tạo người dùng thành công.');
        } catch (error) {
            sendError(res, 500, error.message, error);
        }
    }
}

export default new registerController();
