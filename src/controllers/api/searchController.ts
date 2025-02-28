import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import SearchHistoryController from '@controllers/api/SearchHistoryController';
import sequelize from '@initializers/sequelize';
import UserModel from '@models/users';
import HashtagModel from '@models/hashtags';
import { Op, QueryTypes } from 'sequelize';

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

      let results: any[] = [];

      if (typeStr === 'all') {
        const userTable = UserModel.tableName;
        const hashtagTable = HashtagModel.tableName;

        const sqlQuery = `
          (SELECT id, name, avatar_url, 'user' AS type FROM ${userTable} WHERE name LIKE :query)
          UNION
          (SELECT id, name, NULL AS avatar_url, 'hashtag' AS type FROM ${hashtagTable} WHERE name LIKE :query)
          ORDER BY CASE WHEN name = :query THEN 1 ELSE 2 END, name ASC
          LIMIT :limit OFFSET :offset
        `;

        results = await sequelize.query(sqlQuery, {
          replacements: { query: `%${queryStr}%`, limit: limitNumber, offset: offset },
          type: QueryTypes.SELECT,
        });

      } else if (typeStr === 'user') {
        results = await UserModel.findAll({
          where: { name: { [Op.like]: `%${queryStr}%` } },
          attributes: ['id', 'name', 'avatar_url'],
          limit: limitNumber,
          offset: offset,
          raw: true,
        });

        results = results.map(user => ({ ...user, type: 'user' }));

      } else if (typeStr === 'hashtag') {
        results = await HashtagModel.findAll({
          where: { name: { [Op.like]: `%${queryStr}%` } },
          attributes: ['id', 'name'],
          limit: limitNumber,
          offset: offset,
          raw: true,
        });

        results = results.map(hashtag => ({ ...hashtag, avatar_url: null, type: 'hashtag' }));
      }

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
