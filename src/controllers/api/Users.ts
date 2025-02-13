import { InternalError, NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Request, Response } from 'express';

class UserController {
  public async index (req: Request, res: Response) {
    try {
      const { name, page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const scopes: any[] = [];
      if (name) {
        scopes.push({ method: ['byName', name] });
      }
      const users = await UserModel.scope(scopes).findAndCountAll({
        offset,
        limit: Number(limit),
      });

      sendSuccess(res, { users: users.rows, pagination: { total: users.count, page, limit, totalPages: Math.ceil(users.count / Number(limit)) } });
    } catch (error) {
      return sendError(res, 500, InternalError, error);
    }
  }
}

export default new UserController();
