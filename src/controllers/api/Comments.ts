import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import CommentModel from '@models/comments';
import CommentHashtagModel from '@models/commentHastags';
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
          { model: CommentTagModel, as: 'commentTags' },
          { model: HashtagModel, as: 'hashtags' },
          { model: CommentHashtagModel, as: 'commentHashtags' },
        ],
      });

      return sendSuccess(res, {
        comments: rows,
        pagination: { currentPage: Number(page), totalPages: Math.ceil(count / Number(limit)), total: count },
      }, 'Lấy danh sách bình luận thành công');
    } catch (error) {
      return sendError(res, 500, 'Lỗi khi lấy danh sách bình luận', error.message || error);
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const userId = req.currentUser?.userId ?? 1;
      const { postId } = req.params;
      const { content, parentId } = req.fields || req.body;

      const newComment = await CommentModel.create({
        postId,
        userId,
        content,
        parentId: parentId ? Number(parentId) : null,
      });

      const comment = await CommentModel.findByPk(newComment.id, {
        include: [
          { model: UserModel, attributes: ['id', 'name', 'avatar_url'], as: 'users' },
          { model: CommentTagModel, attributes: ['id', 'comment_id', 'user_id'], as: 'commentTags' },
          { model: HashtagModel, attributes: ['id'], as: 'hashtags' },
          { model: CommentHashtagModel, attributes: ['id', 'comment_id', 'hashtag_id'], as: 'commentHashtags' },
        ],
      });

      return sendSuccess(res, comment, 'Tạo bình luận thành công');
    } catch (error) {
      return sendError(res, 500, 'Lỗi khi tạo bình luận', error.message || error);
    }
  }

  public async update(req: Request, res: Response) {
    try {

      const { id: commentId } = req.params;
      const userId = req.currentUser?.userId ?? 1;
      const { content } = req.fields || req.body;
      const commentInstance = await CommentModel.findOne({ where: { id: commentId, userId } });
      if (!commentInstance) {
        return sendError(res, 404, 'Không tìm thấy bình luận hoặc bạn không có quyền cập nhật.');
      }

      commentInstance.content = content;
      await commentInstance.save();

      const updatedComment = await CommentModel.findByPk(Number(commentId), {
        include: [
          { model: UserModel, attributes: ['id', 'name', 'avatar_url'], as: 'users' },
          { model: CommentTagModel, attributes: ['id', 'comment_id', 'user_id'], as: 'commentTags' },
          { model: HashtagModel, attributes: ['id'], as: 'hashtags' },
          { model: CommentHashtagModel, attributes: ['id', 'comment_id', 'hashtag_id'], as: 'commentHashtags' },
        ],
      });

      return sendSuccess(res, updatedComment, 'Cập nhật bình luận thành công');
    } catch (error) {
      return sendError(res, 500, 'Lỗi khi cập nhật bình luận', error.message || error);
    }
  }


  public async delete(req: Request, res: Response) {
    try {
      const { id: commentId } = req.params;
      const userId = req.currentUser?.userId ?? 1;
      const comment = await CommentModel.findByPk(commentId, {
        include: [
          { model: CommentTagModel, as: 'commentTags' },
          { model: CommentHashtagModel, as: 'commentHashtags' }
        ],
      });

      await CommentTagModel.destroy({ where: { commentId } });
      await CommentHashtagModel.destroy({ where: { commentId } });
      await comment.destroy();

      return sendSuccess(res, {}, 'Xóa bình luận thành công');
    } catch (error) {
      return sendError(res, 500, 'Lỗi khi xóa bình luận', error.message || error);
    }
  }
}

export default new CommentController();