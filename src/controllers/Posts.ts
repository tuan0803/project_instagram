import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import PostService from '@services/posts';

class PostController {
  public async create(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { text } = req.fields;
      const media = req.files?.media;
      if (!media) {
        return sendError(res, 400, 'Media is required to create post');
      }

      const newPost = await PostService.createPost(userId, text, media);
      return sendSuccess(res, newPost, 'Post created successfully');

    } catch (error) {
      return sendError(res, 500, 'Error creating post', error.message || error);
    }
  }
}

export default new PostController();
