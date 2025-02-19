import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import BannedWordModel from '@models/bannedWords';

class BannedWordsController {
  public async create(req: Request, res: Response) {
    try {
      const { words, } = req.body;
      const newBannedHashtag = await BannedWordModel.create(
        {
            words: words,
        },
      );
      return sendSuccess(res, newBannedHashtag, 'done words');
    } catch (error: any) {
      return sendError(res, 500, 'Lỗi khi tạo bình luận', error.message || error);
    }
  }

  public async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (id) {
        const bannedWords = await BannedWordModel.findByPk(id);
        if (!bannedWords) {
          return sendError(res, 404, 'words bị cấm không tồn tại');
        }
        return sendSuccess(res, bannedWords);
      }
      const allBannedWords= await BannedWordModel.findAll();
      return sendSuccess(res, allBannedWords);
    } catch (error: any) {
      return sendError(res, 500, 'Lỗi khi lấy words bị cấm', error.message || error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id || isNaN(Number(id))) {
        return sendError(res, 400, 'ID words bị cấm không hợp lệ');
      }
      const bannedWords = await BannedWordModel.findByPk(id);
      if (!bannedWords) {
        return sendError(res, 404, 'words bị cấm không tồn tại');
      }
      await bannedWords.destroy();
      return sendSuccess(res, {}, 'Xóa words bị cấm thành công');
    } catch (error: any) {
      return sendError(res, 500, 'Lỗi khi xóa words bị cấm', error.message || error);
    }
  }
}

export default new BannedWordsController();
