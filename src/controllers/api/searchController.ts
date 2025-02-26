import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import SearchHistoryController from '@controllers/api/SearchHistoryController';
import { QueryTypes } from 'sequelize';
import sequelize from '@initializers/sequelize';
import UserModel from '@models/users';
import HashtagModel from '@models/hashtags';
class SearchController {
  public async searchUsers(req: Request, res: Response) {
    try {
      const { query = '', limit = 10, page = 1, type = 'all' } = req.query;
      const queryStr = typeof query === 'string' ? query : '';
      const typeStr = typeof type === 'string' ? type : 'all';
      const pageNumber = Number(page);
      const limitNumber = Number(limit);
      const offset = (pageNumber - 1) * limitNumber;

      if (!query) {
        return sendError(res, 400, 'Query empty');
      }
      const userTable = UserModel.tableName; 
      const hashtagTable = HashtagModel.tableName;
      let whereCondition = `name LIKE :query`;
      let sqlQuery = '';

      if (type === 'all') {
        sqlQuery = `
          (SELECT id, name, avatar_url, 'user' AS type FROM ${userTable} WHERE ${whereCondition})
          UNION
          (SELECT id, name, NULL AS avatar_url, 'hashtag' AS type FROM ${hashtagTable} WHERE ${whereCondition})
          ORDER BY CASE WHEN name = :query THEN 1 ELSE 2 END, name ASC
          LIMIT :limit OFFSET :offset
        `;
      } else if (type === 'user') {
        sqlQuery = `SELECT id, name, avatar_url, 'user' AS type FROM ${userTable} WHERE ${whereCondition} LIMIT :limit OFFSET :offset`;
      } else if (type === 'hashtag') {
        sqlQuery = `SELECT id, name, NULL AS avatar_url, 'hashtag' AS type FROM ${hashtagTable} WHERE ${whereCondition} LIMIT :limit OFFSET :offset`;
      }

      const results = await sequelize.query(sqlQuery, {
        replacements: { query: `%${queryStr}%`, limit: limitNumber, offset: offset },
        type: QueryTypes.SELECT,
      });

      await SearchHistoryController.saveSearchHistory(req.currentUser.id, queryStr, typeStr);

      return sendSuccess(res, {
        data: results,
        pagination: {
          total: results.length,
          currentPage: pageNumber,
          limit: limitNumber,
        },
      });
    } catch (error) {
      sendError(res, 500, { errorCode: 135 }, error);
    }
  }
}

export default new SearchController();
