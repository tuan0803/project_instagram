import { Request, Response } from 'express';
import PostModel from '@models/posts';
import HashtagModel from '@models/hashtags';
import { sendError, sendSuccess } from '@libs/response';
import { InternalError } from '@libs/errors';

class PostController {
  public async create (req: Request, res: Response) {
    try {
      const userId = req.currentUser.id;
      const { text, taggedUserIds = [] } = req.body;

      const post = await PostModel.create(
        { text, userId },
        { 
          include: [
            { model: HashtagModel, as: 'hashtags' },
          ],
          taggedUsers: taggedUserIds,
        }
      );      
      sendSuccess(res, { post });
    } catch (error) {
      sendError(res, 500, InternalError, error.message);
    }
  }
}

export default new PostController();
