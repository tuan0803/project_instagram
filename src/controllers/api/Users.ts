import { InternalError, NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Request, Response } from 'express';
import multer from 'multer';
import FileUploaderService from '@services/fileUploader';

const upload = multer();

class UserController {
  public async index (req: Request, res: Response) {
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

  public async show (req: Request, res: Response) {
    try {
      let id = req.params.id;
      if (id === 'me') {
        id = req.currentUser.id;
      }
      const user = await UserModel.scope({ method: ['byId', id] }).findOne();
      if (!user) {
        return sendError(res, 404, NoData);
      }
      return sendSuccess(res, { user: user });
    } catch (error) {
      return sendError(res, 500, InternalError, error);
    }
  }

  public async update (req: Request, res: Response) {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return sendError(res, 400, { message: err.message });
      }

      try {
        const value = req.parameters.permit(UserModel.UPDATABLE_PARAMETERS).value();
        const { id } = req.currentUser;
        const user = await UserModel.scope([{ method: ['byId', id] }]).findOne();
        if (!user) return sendError(res, 404, NoData);
        if (value.isPrivate !== undefined) {
          user.isPrivate = value.isPrivate;
        }
        if (req.file) {
          const filePath = await FileUploaderService.singleUpload(req.file.buffer, req.file.originalname);
          value.avatarUrl = filePath;
        }
        const updatedUser = await user.update(value);
        sendSuccess(res, { data: updatedUser });
      } catch (error) {
        console.log('InternalError', error);
        sendError(res, 500, InternalError, error);
      }
    });
  }

  public async delete (req: Request, res: Response) {
    try {
      const { id } = req.currentUser;
      const user = await UserModel.scope([{ method: ['byId', id] }]).findOne();
      if (!user) {
        return sendError(res, 404, NoData);
      }
      await user.destroy();
      sendSuccess(res, {}, 'Xóa người dùng thành công.');
    } catch (error) {
      sendError(res, 500, InternalError, error);
    }
  }
}

export default new UserController();
