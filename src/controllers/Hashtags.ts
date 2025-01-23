import HashtagsModel from '@models/hashtags';
import HashtagInterface from '@interfaces/hashtags';

class HashtagController {
  public static async handleHashtags (postId: number, hashtags: HashtagInterface[] | undefined) {
    if (hashtags && hashtags.length > 0) {
      const hashtagPromises = hashtags.map(async (hashtag) => {
        const [hashtagRecord] = await HashtagsModel.findOrCreate({
          where: { name: hashtag.name },
          defaults: { name: hashtag.name },
        });

        return hashtagRecord;
      });
      await Promise.all(hashtagPromises);
    }
  }
}

export default HashtagController;
