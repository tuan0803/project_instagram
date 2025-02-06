import { Request, Response } from 'express';
import UserModel from '@models/users';
import { sendError, sendSuccess } from '@libs/response';
import { BadAuthentication, InternalError } from '@libs/errors';


class PasswordController {
    public async update( req: Request, res: Response){
        try {
            const { currentPassword, newPassword } = req.fields;
            const user = await UserModel.findByPk(req.currentUser.userId);
            console.log(user)
            if(!(await user.validPassword(currentPassword))) {
                return sendError(res, 404, BadAuthentication);
            }
            await user.update({ password: newPassword });
            sendSuccess(res, {}, 'Success')
        } catch (error) {
            sendError(res, 500, InternalError, error)
        }
    }
}

export default new PasswordController();