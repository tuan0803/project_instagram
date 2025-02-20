import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import CommentModel from '@models/comments';
<<<<<<< HEAD
import HashtagModel from '@models/hashtags';
<<<<<<< HEAD
<<<<<<< HEAD
import CommentTagModel from '@models/commentTags';
<<<<<<< HEAD
=======
import CommentHashtagModel from '@models/commentHastags';
import CommentTagModel from '@models/commentTags';
import HashtagModel from '@models/hashtags';
>>>>>>> a652d66 (loi tao bang trung gian)
import UserModel from '@models/users';
=======
>>>>>>> 08f9925 (include)
=======
>>>>>>> 1511fce (xong tag)
=======
import CommentTagModel from '@models/commentTags';
>>>>>>> 1e54a5d (fix comment)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      const { postId, } = req.params;
=======
      const { postId } = req.params;
>>>>>>> a652d66 (loi tao bang trung gian)
      const { content, parentId } = req.fields || req.body;
=======
      const { postId, parentId } = req.params;
      const { content, taggedUserIds = [], } = req.fields || req.body;
>>>>>>> 1511fce (xong tag)
=======
      const { postId, } = req.params;
      const { content, parentId } = req.fields || req.body;
>>>>>>> 1e54a5d (fix comment)

<<<<<<< HEAD
      const newComment = await CommentModel.create(
        {
          postId: postId,
          userId: userId,
          content,
          parentId: parentId ? Number(parentId) : null,
        },
        {
          include: [
            { model: HashtagModel, as: 'hashtags' },
<<<<<<< HEAD
<<<<<<< HEAD
            {
              model: CommentTagModel,
              as: 'commentTags',
              include: [{ model: UserModel, as: 'user' }],
            },
          ],
        },
      );

=======
=======
            { model: CommentTagModel, as: 'commentTags' },
>>>>>>> 1e54a5d (fix comment)
          ],
        },
      );
>>>>>>> 1511fce (xong tag)
      return sendSuccess(res, newComment, 'Tạo bình luận thành công');
    } catch (error: any) {
=======
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
>>>>>>> a652d66 (loi tao bang trung gian)
      return sendError(res, 500, 'Lỗi khi tạo bình luận', error.message || error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      const userId = req.currentUser?.userId ?? 1;
      const { content } = req.fields || req.body;

      if (!content?.trim()) {
        return sendError(res, 400, 'Nội dung bình luận không được để trống.');
      }
      const comment = await CommentModel.findByPk(commentId);
      if (!comment) {
        return sendError(res, 404, 'Không tìm thấy bình luận.');
      }
      if (comment.userId !== userId) {
        return sendError(res, 403, 'Bạn không có quyền chỉnh sửa bình luận này.');
      }

      await comment.update({ content });
      const updatedComment = await CommentModel.findByPk(commentId, {
        include: [
          { model: UserModel, attributes: ['id', 'name', 'avatar_url'], as: 'users' },
          { model: CommentTagModel, as: 'commentTags' },
          { model: HashtagModel, as: 'hashtags' },
          { model: CommentHashtagModel, as: 'commentHashtags' }
        ],
      });

      return sendSuccess(res, updatedComment, 'Cập nhật bình luận thành công');
    } catch (error) {
      return sendError(res, 500, 'Lỗi khi cập nhật bình luận', error.message || error);
    }

  public async delete(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      const userId = req.currentUser?.userId ?? 1;
      const comment = await CommentModel.findByPk(commentId, {
        include: [
          { model: CommentTagModel, as: 'commentTags' },
          { model: CommentHashtagModel, as: 'commentHashtags' }
        ],
      });

      if (!comment) {
        return sendError(res, 404, 'Không tìm thấy bình luận.');
      }
      if (comment.userId !== userId) {
        return sendError(res, 403, 'Bạn không có quyền xóa bình luận này.');
      }

      await CommentTagModel.destroy({ where: { commentId } });
      await CommentHashtagModel.destroy({ where: { commentId } });
      await comment.destroy();

      return sendSuccess(res, {}, 'Xóa bình luận thành công');
    } catch (error) {
      return sendError(res, 500, 'Lỗi khi xóa bình luận', error.message || error);
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

export default new CommentController();
