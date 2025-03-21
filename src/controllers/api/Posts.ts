import { Request, Response } from 'express';
import PostModel from '@models/posts';
import HashtagModel from '@models/hashtags';
import { sendError, sendSuccess } from '@libs/response';
import { InternalError } from '@libs/errors';
import UserModel from '@models/users';



class PostController {
  public async create(req: Request, res: Response) {
    try {
      const userId = req.currentUser.id;
      const { text } = req.body;
      const post = await PostModel.create(
        {
          text,
          userId
        },
        {
          include: [
            { 
                model: HashtagModel, 
                as: 'hashtags', 
                through: { attributes: [] }
            },
            {
                model: UserModel,
                as: 'users',
                through: { attributes: [] },
            }
          ],
        }
      );        
      sendSuccess(res, { post });
    } catch (error) {
      sendError(res, 500, InternalError, error.message);
    }
  } 
}

export default new PostController();
