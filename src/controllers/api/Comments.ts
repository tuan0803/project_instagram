import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import CommentModel from '@models/comments';
import CommentHashtagModel from '@models/commentHashtags';
import CommentTagModel from '@models/commentTags';
import HashtagModel from '@models/hashtags';
import UserModel from '@models/users';

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
        include: [
          { model: UserModel, attributes: ['id', 'name', 'avatar_url'], as: 'users' },
          { model: HashtagModel, as: 'hashtags' },
        ],
      });

      return sendSuccess(res, {
        comments: rows,
        pagination: { currentPage: Number(page), totalPages: Math.ceil(count / Number(limit)), total: count },
      }, 'Lấy danh sách bình luận thành công');
    } catch (error) {
      return sendError(res, 400, error.message || 'Lỗi khi lấy danh sách bình luận', error);
    }
  }

  public async create(req: Request, res: Response) {
    const transaction = await CommentModel.sequelize.transaction();
    try {
      const userId = req.currentUser?.id;
      const { postId } = req.params;
      const { content, parentId } = req.fields || req.body;

      const newComment = await CommentModel.create(
        { postId, userId, content, parentId: parentId ? Number(parentId) : null },
        { transaction }
      );
      await transaction.commit();
      const comment = await CommentModel.findByPk(newComment.id, {
        include: [
          { model: UserModel, attributes: ['id', 'name', 'avatar_url'], as: 'users' },
          { model: HashtagModel, attributes: ['id', 'name'], as: 'hashtags' },
        ],
      });
      return sendSuccess(res, comment, 'Tạo bình luận thành công');
    } catch (error) {
      await transaction.rollback();
      return sendError(res, 400, error.message || 'Lỗi khi Tạo bình luận', error);
    }
  }

  public async update(req: Request, res: Response) {
    const transaction = await CommentModel.sequelize.transaction();
    try {
      const { id: commentId } = req.params;
      const userId = req.currentUser?.id;
      const { content } = req.fields || req.body;
      const commentInstance = await CommentModel.findOne({ where: { id: commentId, userId } });
      if (!commentInstance) {
        throw new Error('Bình luận không tồn tại hoặc bạn không có quyền chỉnh sửa');
      }
      commentInstance.content = content;
      await commentInstance.save({ transaction });
      await transaction.commit();
      const updatedComment = await CommentModel.findByPk(Number(commentId), {
        include: [
          { model: UserModel, attributes: ['id', 'name', 'avatar_url'], as: 'users' },
          { model: HashtagModel, attributes: ['id', 'name'], as: 'hashtags' },
        ],
      });

      return sendSuccess(res, updatedComment, 'Cập nhật bình luận thành công');
    } catch (error) {
      await transaction.rollback();
      return sendError(res, 400, error.message || 'Lỗi khi cập nhật bình luận', error);
    }
  }

  public async delete(req: Request, res: Response) {
    const transaction = await CommentModel.sequelize.transaction();
    try {
      const { id: commentId } = req.params;
      const userId = req.currentUser?.id;

      const comment = await CommentModel.findOne({ where: { id: commentId, userId } });
      if (!comment) {
        throw new Error('Bình luận không tồn tại hoặc bạn không có quyền xóa');
      }

      await comment.destroy({ transaction });
      await transaction.commit();

      return sendSuccess(res, {}, 'Xóa bình luận thành công');
    } catch (error) {
      await transaction.rollback();
      return sendError(res, 400, error.message || 'Lỗi khi xóa bình luận', error);
    }
  }
}

export default new CommentController();