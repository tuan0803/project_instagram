import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import BannedHashtagModel from '@models/bannedHashtags';

class BannedHashtagController {
    public async create(req: Request, res: Response) {
        try {
          const { hashtag, } = req.body;
          console.log(hashtag,"hashtag");
          const newBannerHastag = await BannedHashtagModel.create(
            {
                hashtag: hashtag,
            },
          );
          return sendSuccess(res, newBannerHastag, 'Tạo bình luận thành công');
        } catch (error: any) {
          return sendError(res, 500, 'Lỗi khi tạo bình luận', error.message || error);
        }
      }
}

export default new BannedHashtagController();
