import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Op } from 'sequelize';
import HashtagModel from '@models/hashtags';
import SearchHistoryController from '@controllers/api/SearchHistoryController';
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
      let users: any[] = [];
      let totalUsers = 0;
      if( type === 'all' || type === 'user') {
      const userResult = await UserModel.findAndCountAll({
        where: {
          name: {
            [Op.like]: `%${query}%`, 
            
          },
        },
        attributes: ['id', 'name', 'avatar_url'], 
        limit: limitNumber,
        offset: offset,
      });
      users = userResult.rows;
      totalUsers = userResult.count;
      }
      let hashtags: any[] = [];
      let totalHashtags = 0;
      if( type === 'all' || type === 'hashtag') {
        const hashtagResult = await HashtagModel.findAndCountAll({
          where: {
            name: {
              [Op.like]: `%${query}%`,
              },
            },
            attributes: ['id', 'name'],
            limit: limitNumber,
            offset: offset,
        });
        hashtags = hashtagResult.rows;
        totalHashtags = hashtagResult.count;
      }
      let results = [...users, ...hashtags];
      results.sort((a, b) => {
        if (a.type === 'user' && b.type === 'hashtag') return -1;
        if (a.type === 'hashtag' && b.type === 'user') return 1;
        const aExact = a.name.toLowerCase() === queryStr.toLowerCase();
        const bExact = b.name.toLowerCase() === queryStr.toLowerCase();
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
  
        return 0; 
      });
      await SearchHistoryController.saveSearchHistory(req.currentUser.id, queryStr, typeStr);
      const totalPagesUser = Math.ceil(totalUsers / limitNumber);
      const totalPagesHashtags = Math.ceil(totalHashtags / limitNumber);
      return sendSuccess(res, {
        users: {
          data: users,
          pagination: {
            total: totalPagesUser,
            currentPage: pageNumber,
            limit: limitNumber,
          },
        },
        hashtags: {
          data: hashtags,
          pagination:{
            total: totalPagesHashtags,
            currentPage: pageNumber,
            limit: limitNumber,
          },
        },
      });
    } catch (error) {
      sendError(res, 500, { errorCode: 135 }, error);
    }
  }
  
}

export default new SearchController();
