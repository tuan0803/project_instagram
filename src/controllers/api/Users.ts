import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';

class UserController {
    public async index(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10, name } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            const scopes: any = [];

            if(name){
                scopes.push({ method: ['byName', name ]});
            }
            const users = await UserModel.scope(scopes).findAndCountAll({
                offset,
                limit: Number(limit),
                order: [['created_at', 'DESC']],
            });

            return sendSuccess(res, {
                items: users.rows,
                total: users.count,
                page: Number(page),
                limit: Number(limit),
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            return sendError(res, 500, 'Error fetching users');
        }
    }

    public async show(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const user = await UserModel.findOne({ where: { id } });
            if (!user) {
                return sendError(res, 404, 'User not found');
            }
            return sendSuccess(res, user);
        } catch (error) {
            console.error('Error fetching user:', error);
            return sendError(res, 500, 'Error fetching user');
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const value = req.parameters.permit(UserModel.UPDATABLE_PARAMETERS).value();
            const { userId }  = req.user;
            console.log(userId)
            const user = await UserModel.findOne({ where: { id: userId } });
            if (!user) {
                return sendError(res, 404, 'User not found');
            }

            

            const updatedUser = await user.update(value); 
            return sendSuccess(res, { item: updatedUser }, 'Cập nhật người dùng thành công.');
        } catch (error) {
            console.error('Error updating user:', error);
            return sendError(res, 500, 'Error updating user');
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { userId }  = req.user;

            const user = await UserModel.findOne({ where: { id: userId  } });
            if (!user) {
                return sendError(res, 404, 'User not found');
            }

            await user.destroy(); 
            return sendSuccess(res, {}, 'Xóa người dùng thành công.');
        } catch (error) {
            console.error('Error deleting user:', error);
            return sendError(res, 500, 'Error deleting user');
        }
    }
}

export default new UserController();
