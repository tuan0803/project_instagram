import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Op } from 'sequelize';
import SearchHistoryModel from '@models/search';
import HashtagModel from '@models/hashtags';
class SearchController {
  public async searchUsers(req: Request, res: Response) {
    try {
      const { query = '', limit = 10, page = 1, type = 'all' } = req.query;
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
      await SearchHistoryModel.create({
        type: 'user',
        userId: req.currentUser.id,
        query : query,
      });
      
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
  public async getSearchHistory(req: Request, res: Response) {
    try {
        const userId = req.currentUser.id;
        const history = await SearchHistoryModel.findAll({
            where : {user_id: userId},
            order: [['created_at', 'DESC']],
            limit: 10,
        
        });
        
        return sendSuccess(res, { history });
    
    } catch (error) {
        sendError(res, 500, { errorCode: 136 }, error);
    }
  }
}

export default new SearchController();
