import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import BannedHashtagModel from '@models/bannedHashtags';

class BannedHashtagController {
  public async create(req: Request, res: Response) {
    try {
      const { hashtag, } = req.body;
      const newBannedHashtag = await BannedHashtagModel.create(
        {
          hashtag: hashtag,
        },
      );
      return sendSuccess(res, newBannedHashtag, 'done hashtag');
    } catch (error: any) {
      return sendError(res, 500, 'Lỗi khi tạo bình luận', error.message || error);
    }
  }

  public async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (id) {
        const bannedHashtag = await BannedHashtagModel.findByPk(id);
        if (!bannedHashtag) {
          return sendError(res, 404, 'Hashtag bị cấm không tồn tại');
        }
        return sendSuccess(res, bannedHashtag);
      }
      const allBannedHashtags = await BannedHashtagModel.findAll();
      return sendSuccess(res, allBannedHashtags);
    } catch (error: any) {
      return sendError(res, 500, 'Lỗi khi lấy hashtag bị cấm', error.message || error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id || isNaN(Number(id))) {
        return sendError(res, 400, 'ID hashtag bị cấm không hợp lệ');
      }
      const bannedHashtag = await BannedHashtagModel.findByPk(id);
      if (!bannedHashtag) {
        return sendError(res, 404, 'Hashtag bị cấm không tồn tại');
      }
      await bannedHashtag.destroy();
      return sendSuccess(res, {}, 'Xóa hashtag bị cấm thành công');
    } catch (error: any) {
      return sendError(res, 500, 'Lỗi khi xóa hashtag bị cấm', error.message || error);
    }
  }
}

export default new BannedHashtagController();
