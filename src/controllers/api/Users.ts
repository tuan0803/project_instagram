import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import fs from 'fs';
import path from 'path';
import FileUploaderService from '@services/fileUploader';
import { InternalError, NoData } from '@libs/errors';

class UserController {
    public async index(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10, name } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            const scopes: any[] = []; 
            if (name) {
                scopes.push({ method: ['byName', name] });
            }
            const users = await UserModel.scope(scopes).findAndCountAll({
                offset,
                limit: Number(limit),
            });

            if (!users.count) {
                return sendError(res, 404, NoData);
            }

            return sendSuccess(res, {
                items: users.rows,
                total: users.count,
                page: Number(page),
                limit: Number(limit),
            });
        } catch (error) {
            return sendError(res, 500, InternalError, error);
        }
    }

    public async show(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const user = UserModel.scope([{ method: [ 'byId', id]}]).findOne();
            if (!user) {
                return sendError(res, 404, NoData);
            }
            return sendSuccess(res, { user });
        } catch (error) {
            return sendError(res, 500, InternalError, error);
        }
    }
    
    public async update(req: Request, res: Response) {
        try {
            const value = req.fields;
            const { userId } = req.currentUser;
            const user = await UserModel.scope([{ method: [ 'byId', userId]}]).findOne();
            if (!user) {
                return sendError(res, 404, NoData);
            }
    
            if (value.isPrivate !== undefined) {
                user.isPrivate = value.isPrivate;
            }

            if (req.files && req.files.avatar) {
                const avatarFile = req.files.avatar;
                const buffer = fs.readFileSync(avatarFile.path);
                const folder = path.join(path.resolve('./'), 'public', 'upload', 'users');
                const fileName = `${userId}_${Date.now()}_${avatarFile.name}`;
                const filePath = path.join('users', fileName);
    
                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder, { recursive: true });
                }
    
                const uploadedPath = await FileUploaderService.singleUpload(buffer, filePath);
                value.avatarUrl = uploadedPath;
            }
            
            const updatedUser = await user.update(value);
            return sendSuccess(res, { item: updatedUser }, 'Cập nhật người dùng thành công.');
        } catch (error) {
            return sendError(res, 500, InternalError, error);
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { userId }  = req.currentUser;
            const user = await UserModel.scope([{ method: [ 'byId', userId]}]).findOne();
            if (!user) {
                return sendError(res, 404, NoData);
            }
            await user.destroy(); 
            return sendSuccess(res, {}, 'Xóa người dùng thành công.');
        } catch (error) {
            return sendError(res, 500, InternalError, error);
        }
    }
}

export default new UserController();
