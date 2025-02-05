import { Request, Response } from 'express';
import dayjs from 'dayjs';
import { sendError, sendSuccess } from '@libs/response';
import { NoData } from '@libs/errors';
import Settings from '@configs/settings';
import NotificationModel from '@models/notifications';

class NotificationController {
  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string) || parseInt(Settings.defaultPerPage);
      const offset = (page - 1) * limit;
      const scopes: any = [
        { method: ['byUser', req.currentUser['x-user-id']] },
        { method: ['bySorting', 'createdAt', 'DESC'] },
      ];
      const { isUnRead } = req.query;
      if (isUnRead === 'true') scopes.push('isUnRead');
      const { rows, count } = await NotificationModel.scope(scopes).findAndCountAll({ offset, limit });
      const totalUnread = await NotificationModel.scope([
        { method: ['byUser', req.currentUser['x-user-id']] },
      ]).count({ where: { readAt: null } });
      sendSuccess(res, { items: rows, totalUnread, pagination: { limit, offset, total: count } }, 'Thành công');
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const notification = await NotificationModel.scope([
        { method: ['byUser', req.currentUser['x-user-id']] },
        { method: ['byId', req.params.notificationId] },
      ]).findOne();
      if (!notification) return sendError(res, 404, NoData);
      sendSuccess(res, { item: notification }, 'Thành công');
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async read (req: Request, res: Response) {
    try {
      const notification = await NotificationModel.scope([
        { method: ['byUser', req.currentUser['x-user-id']] },
        { method: ['byId', req.params.notificationId] },
      ]).findOne();
      if (!notification) return sendError(res, 404, NoData);
      await notification.update({ readAt: dayjs() });
      sendSuccess(res, { item: notification }, 'Cập nhật dữ liệu thành công.');
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async readAll (req: Request, res: Response) {
    try {
      await NotificationModel.update(
        { readAt: dayjs() },
        { where: { userId: req.currentUser['x-user-id'] } },
      );
      sendSuccess(res, { }, 'Cập nhật dữ liệu thành công.');
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const notification = await NotificationModel.scope([
        { method: ['byUser', req.currentUser['x-user-id']] },
        { method: ['byId', req.params.notificationId] },
      ]).findOne();
      if (!notification) return sendError(res, 404, NoData);
      await notification.destroy();
      sendSuccess(res, { }, 'Xoá dữ liệu thành công.');
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async deleteAll (req: Request, res: Response) {
    try {
      await NotificationModel.destroy({ where: { userId: req.currentUser['x-user-id'] } });
      sendSuccess(res, { }, 'Xoá dữ liệu thành công.');
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new NotificationController();
