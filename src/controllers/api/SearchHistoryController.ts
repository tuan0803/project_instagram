import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import SearchHistoryModel from '@models/search';

class SearchHistoryController {
  public async saveSearchHistory(userId: number, query: string, type: string) {
    try {
      await SearchHistoryModel.create({
        userId: userId,
        query: query,
        type: type,
      });
    } catch (error) {
    }
  }

  public async getSearchHistory(req: Request, res: Response) {
    try {
      const userId = req.currentUser.id;
      const history = await SearchHistoryModel.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
        limit: 10,
      });

      return sendSuccess(res, { history });
    } catch (error) {
      sendError(res, 500, { errorCode: 136 }, error);
    }
  }
}

export default new SearchHistoryController();
