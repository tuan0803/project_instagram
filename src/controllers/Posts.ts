import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import PostModel from '@models/posts';

class PostController {
  public async create(req: Request, res: Response) {
    const { userId } = req.currentUser || 1;
    const text  = Array.isArray(req.fields.text) ? req.fields.text.join(', ') : req.fields.text;
    
    const media = req.files?.media;

    if (!media) {
      return sendError(res, 400, 'Media is required to create post');
    }

    try {
      const newPost = await PostModel.create({ userId, text });
      return sendSuccess(res, newPost, 'Post created successfully');
    } catch (error) {
      return sendError(res, 500, 'Error creating post', error.message || error);
    }
  }
}

export default new PostController();
