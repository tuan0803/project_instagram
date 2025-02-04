import HashtagsModel from '@models/hashtags';
import PosthashtagController from './Post_hashtags';

class HashtagController {
  public async create(postId: number, names: string[]) {
    try {
      for (const name of names) {
        const [hashtag] = await HashtagsModel.findOrCreate({
          where: { name },
          defaults: { name },
        });
        await PosthashtagController.create(postId, hashtag.id);
      }

    } catch (error) {
      throw error;
    }
  }
}

export default new HashtagController();