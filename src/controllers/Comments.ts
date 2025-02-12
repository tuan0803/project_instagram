import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import CommentModel from '@models/comments';

class CommentController {
  public async get(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const { page = 1, limit = 15 } = req.query;
      const comments = await CommentModel.getComments(Number(postId), Number(page), Number(limit));

      return sendSuccess(res, comments, 'Lấy danh sách bình luận thành công');
    } catch (error) {
      return sendError(res, 500, 'Lỗi khi lấy danh sách bình luận', error.message || error);
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const { userId } = req.currentUser ?? { userId: 1 };
      const { postId, parentId } = req.params;
      const { content } = req.fields || req.body;
      const newComment = await CommentModel.createComment(Number(postId), Number(userId), content, parentId ? Number(parentId) : undefined);
      return sendSuccess(res, newComment, 'Tạo bình luận thành công');
    } catch (error) {
      return sendError(res, 500, 'Lỗi khi tạo bình luận', error.message || error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { content } = req.fields || req.body;
      const { userId } = req.currentUser ?? { userId: 1 };

      if (!content) {
        return sendError(res, 400, 'Nội dung bình luận không được để trống');
      }
      const comment = await CommentModel.findByPk(Number(id));
      if (!comment) {
        return sendError(res, 404, 'Không tìm thấy bình luận');
      }
      if (comment.userId !== userId) {
        return sendError(res, 403, 'Bạn không có quyền cập nhật bình luận này');
      }
      const updatedComment = await CommentModel.updateComment(Number(id), content);

      return sendSuccess(res, updatedComment, 'Cập nhật bình luận thành công');
    } catch (error) {
      return sendError(res, 500, 'Lỗi khi cập nhật bình luận', error.message || error);
    }
  }


  public async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await CommentModel.deleteComment(Number(id));
      const { userId } = req.currentUser ?? { userId: 1 };

      if (!deleted) {
        return sendError(res, 404, 'Không tìm thấy bình luận');
      }
      const comment = await CommentModel.findByPk(Number(id));
      if (!comment) {
        return sendError(res, 404, 'Không tìm thấy bình luận');
      }
      if (comment.userId !== userId) {
        return sendError(res, 403, 'Bạn không có quyền cập nhật bình luận này');
      }

      return sendSuccess(res, null, 'Xóa bình luận thành công');
    } catch (error) {
      return sendError(res, 500, 'Lỗi khi xóa bình luận', error.message || error);
    }
  }
}

export default new CommentController();
