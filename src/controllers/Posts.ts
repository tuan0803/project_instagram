import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import PostModel from '@models/posts';
import MediaController from '@controllers/Medias';

class PostController {
  public async create(req: Request, res: Response) {
    try {
      const mediaBuffer = req.files?.media;
      if (!mediaBuffer || (mediaBuffer.size === 0)) {
        return sendError(res, 400, 'Media is required to create post');
      } else {
        const userId = req.params.userId;
        const text = req.body.text;
        const value = PostModel.CREATABLE.reduce((acc: any, field: string) => {
          if (field === 'userId') acc[field] = userId;
          if (field === 'text') acc[field] = text;
          return acc;
        }, {});
        const newPost = await PostModel.create(value);
        await MediaController.create(newPost.userId, newPost.id, mediaBuffer);
        return sendSuccess(res, newPost, 'Post created successfully');
      }
    } catch (error) {
      return sendError(res, 500, 'Error creating post', error.message || error);
    }
  }
}

export default new PostController();
