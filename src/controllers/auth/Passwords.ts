import { Request, Response } from 'express';
import UserModel from '@models/users';
import { sendError, sendSuccess } from '@libs/response';
import { BadAuthentication, InternalError } from '@libs/errors';


class PasswordController {
    public async update(req: Request, res: Response) {
        try {
            const { currentPassword, newPassword, passwordConfirmation } = req.fields;
            const user = await UserModel.findByPk(req.currentUser.userId);
            if (!(await user.validPassword(currentPassword))) {
                return sendError(res, 404, BadAuthentication);
            }
            await user.update({ currentPassword, password: newPassword, passwordConfirmation });

            sendSuccess(res, {}, 'Success');
        } catch (error) {
            sendError(res, 500, InternalError, error);
        }
    }   
}

export default new PasswordController();