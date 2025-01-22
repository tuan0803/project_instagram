import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';

class ReactionController {
  static readonly REACTIONS = [
    'like', // Thích
  ];

  public async create (req: Request, res: Response) {
    try {
      const { userId, postId } = req.params;
      const { type } = req.body;
      if (!ReactionController.REACTIONS.includes(type)) {
        return sendError(res, 400, 'không hợp lệ');
      }
      sendSuccess(res, { userId, postId, type }, 'Thành công');
    } catch (error) {
      sendError(res, 500, 'Lỗi', error.message || error);
    }
  }
}

export default ReactionController;
