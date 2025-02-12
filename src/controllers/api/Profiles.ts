import { InternalError, NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Request, Response } from 'express';
import multer from 'multer';
import FileUploaderService from '@services/fileUploader';

const upload = multer();

class ProfileController {
  public async show (req: Request, res: Response) {
    try {
      const { id } = req.currentUser;
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

export default new ProfileController();
