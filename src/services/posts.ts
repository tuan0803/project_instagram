import PostModel from '@models/posts';
import MediaModel from '@models/medias';
import HashtagModel from '@models/hashtags';
import FileUploaderService from '@services/fileUploader';
import fs from 'fs';
import path from 'path';
import PostHashtagsModel from '@models/post_hashtags';

class PostService {
  static async createPost(userId: number, text: string, mediaBuffer?: Express.Multer.File) {
    const transaction = await PostModel.sequelize?.transaction();
    try {
      const post = await PostModel.create({ userId, text }, { transaction });

      if (mediaBuffer) {
        const buffer = mediaBuffer.buffer || fs.readFileSync(mediaBuffer.path);
        const fileNameSource = mediaBuffer.originalname || mediaBuffer.name;
        const extension = path.extname(fileNameSource).toLowerCase();
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv'];
        let fileType: 'image' | 'video' | null = null;
        if (imageExtensions.includes(extension)) {
          fileType = 'image';
        } else if (videoExtensions.includes(extension)) {
          fileType = 'video';
        } else {
          throw new Error('Unsupported media format');
        }
        const fileName = `${userId}_${Date.now()}${extension}`;
        const url = await FileUploaderService.singleUpload(buffer, fileName);
        await MediaModel.create({ postId: post.id, userId, url, type: fileType }, { transaction });
      }

      const hashtags = text?.match(/#[\w]+/g) ?? [];
      const hashtagInstances = await Promise.all(
        hashtags.map(tag => HashtagModel.findOrCreate({
          where: { name: tag },
          defaults: { name: tag },
          transaction
        }))
      );
      
      const postHashtagsData = hashtagInstances.map(([hashtag]) => ({
        postId: post.id,
        hashtagId: hashtag.id,
      }));
      await PostHashtagsModel.bulkCreate(postHashtagsData, { transaction });
      
      await transaction?.commit();
      return post;
    } catch (error) {
      await transaction?.rollback();
      throw new Error(`Lỗi tạo bài post: ${error.message}`);
    }
  }
}

export default PostService;
