import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import CommentModel from '@models/comments';
import HashtagModel from '@models/hashtags';
import CommentTagModel from '@models/commentTags';

class CommentController {
  public async get(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const { page = 1, limit = 16 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows } = await CommentModel.findAndCountAll({
        where: { postId },
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset,
      });
      const totalPages = Math.ceil(count / Number(limit));

      return sendSuccess(res, {
        comments: rows,
        pagination: {
          currentPage: Number(page),
          totalPages,
          limit: Number(limit),
          totalComments: count,
        },
      }, 'Lấy danh sách bình luận thành công');
    } catch (error: any) {
      return sendError(res, 500, 'Lỗi khi lấy danh sách bình luận', error.message || error);
    }
  }


  public async create(req: Request, res: Response) {
    try {
      const userId = req.currentUser?.userId ?? 1;
      const { postId, parentId } = req.params;
      const { content, taggedUserIds = [], taggedHastagIds = [] } = req.fields || req.body;
      const newComment = await CommentModel.create({
        postId: postId,
        userId: userId,
        content,
        parentId: parentId ? Number(parentId) : null,
      },
        {
          include: [
            {
              model: HashtagModel,
              as: 'hashtags',
              through: {
                where: { id: taggedHastagIds },
              },
            },
            {
              model: CommentTagModel,
              as: 'commentTags',
              through: {
                where: { userId: taggedUserIds },
              },
            },
          ],
        });

      return sendSuccess(res, newComment, 'Tạo bình luận thành công');
    } catch (error: any) {
      return sendError(res, 500, 'Lỗi khi tạo bình luận', error.message || error);
    }
  }


  public async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) {
        return sendError(res, 400, 'ID bình luận không hợp lệ');
      }

      const { content } = req.fields || req.body;
      if (!content) {
        return sendError(res, 400, 'Nội dung bình luận không được để trống');
      }

      console.log(content, "content", id, "id");
      const comment = await CommentModel.findByPk(Number(id));
      if (!comment) {
        return sendError(res, 404, 'Không tìm thấy bình luận');
      }

      await comment.update({ content });
      return sendSuccess(res, comment, 'Cập nhật bình luận thành công');
    } catch (error: any) {
      return sendError(res, 500, 'Lỗi khi cập nhật bình luận', error.message || error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) {
        return sendError(res, 400, 'ID bình luận không hợp lệ');
      }

      const comment = await CommentModel.findByPk(Number(id));
      if (!comment) {
        return sendError(res, 404, 'Không tìm thấy bình luận');
      }

      await comment.destroy();
      return sendSuccess(res, null, 'Xóa bình luận thành công');
    } catch (error: any) {
      return sendError(res, 500, 'Lỗi khi xóa bình luận', error.message || error);
    }
  }

}

export default new CommentController();
