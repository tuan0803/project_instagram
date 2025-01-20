import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import PostModel from '@models/posts';
import MediaController from './Medias';
import HashtagController from './Hashtags';
import ReactionController from './Reactions';

class PostController {
  public async create (req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const { text, media, hashtags, reactions } = req.body;
      const newPost = await PostModel.create({ userId, text, commentCount: 0, reactionCount: 0 });
      await MediaController.handleMedia(newPost.id, media);
      await HashtagController.handleHashtags(newPost.id, hashtags);
      await ReactionController.handleReactions(newPost.id, reactions);

      sendSuccess(res, newPost, 'Tạo bài viết thành công');
    } catch (error) {
      sendError(res, 500, 'Lỗi khi tạo bài viết', error.message || error);
    }
  }
}

export default new PostController();
