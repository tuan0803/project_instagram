import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import PostModel from '@models/posts';
import { PostCreationAttributes } from '@interfaces/posts';

class PostController {
  public async getAllPosts (req: Request, res: Response) { // hien thi tat ca trong trang ca nhan 3x8
    try {
      console.log(1);
      const { userId } = req.params;
      const { page = 1, limit = 24 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const posts = await PostModel.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset: offset,
      });
      return sendSuccess(res, posts, 'Lấy danh sách bài viết thành công');
    } catch (error) {
      return sendError(res, 500, 'Lỗi khi lấy danh sách bài viết', error.message || error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const { text } = req.body;
      const newPost = await PostModel.create({
        userId,
        text,
      } as PostCreationAttributes);

      return sendSuccess(res, newPost, 'Tạo bài viết thành công');
    } catch (error) {
      return sendError(res, 500, 'Lỗi khi tạo bài viết', error.message || error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const { text } = req.body;
      const post = await PostModel.findByPk(postId);
      if (!post) {
        return sendError(res, 404, 'Bài viết không tồn tại');
      }
      post.text = text;
      await post.save();
      return sendSuccess(res, post, 'Cập nhật bài viết thành công');
    } catch (error) {
      return sendError(res, 500, 'Lỗi khi cập nhật bài viết', error.message || error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const post = await PostModel.findByPk(postId);
      if (!post) {
        return sendError(res, 404, 'Bài viết không tồn tại');
      }
      await post.destroy();
      sendSuccess(res, null, 'Xóa bài viết thành công');
    } catch (error) {
      sendError(res, 500, 'Lỗi khi xóa bài viết', error.message || error);
    }
  }
}

export default new PostController();
