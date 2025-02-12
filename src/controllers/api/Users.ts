import { InternalError, NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Request, Response } from 'express';

class ProfileController {
  public async index (req: Request, res: Response) {
    try {
      const { name } = req.query;
      const scopes: any[] = [];
      if (name) {
        scopes.push({ method: ['byName', name] });
      }
      const users = await UserModel.scope(scopes).findAndCountAll();

      if (!users.count) {
        return sendError(res, 404, NoData);
      }

      return sendSuccess(res, { users: users.rows });
    } catch (error) {
      return sendError(res, 500, InternalError, error);
    }
  }
}

export default new ProfileController();
