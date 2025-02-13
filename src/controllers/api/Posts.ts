import { Request, Response } from 'express';
import PostModel from '@models/posts';
import HashtagModel from '@models/hashtags';
import { sendSuccess } from '@libs/response';

class PostController {
  public async create (req: Request, res: Response) {
    const userId = req.currentUser.id;
    const { text } = req.body;

    const post = await PostModel.create(
        { text, userId },
        { include: [{ model: HashtagModel, as: 'hashtags' }] }
      );      

    sendSuccess(res, { post });
  }
}

export default new PostController();
