import MediaModel from '@models/medias';
import MediaInterface from '@interfaces/medias';

class MediaController {
  public static async handleMedia (postId: number, media: MediaInterface[] | undefined) {
    if (media && media.length > 0) {
      const mediaPromises = media.map((item) =>
        MediaModel.create({ postId: postId, url: item.url, type: item.type }),
      );
      await Promise.all(mediaPromises);
    }
  }
}

export default MediaController;
