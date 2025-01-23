import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import PostService from '@services/Posts';

class PostController {
  public async getAllPosts(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 24 } = req.query;

      const posts = await PostService.getAllPosts(Number(userId), Number(page), Number(limit));

      return sendSuccess(res, posts, 'Lấy danh sách bài viết thành công');
    } catch (error) {
      return sendError(res, 400, 'Lỗi khi lấy danh sách bài viết !!', error.message || error);
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const { text } = req.body;
      const newPost = await PostService.create(userId, text);

      return sendSuccess(res, newPost, 'Tạo bài viết thành công');
    } catch (error) {
      return sendError(res, 500, 'Lỗi khi tạo bài viết', error.message || error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const { text } = req.body;
      const updatedPost = await PostService.update(Number(postId), String(text));

      return sendSuccess(res, updatedPost, 'Cập nhật bài viết thành công');
    } catch (error) {
      return sendError(res, 500, 'Lỗi khi cập nhật bài viết', error.message || error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      await PostService.delete(Number(postId));

      return sendSuccess(res, null, 'Xóa bài viết thành công');
    } catch (error) {
      return sendError(res, 500, 'Lỗi khi xóa bài viết', error.message || error);
    }
  }
}

export default new PostController();