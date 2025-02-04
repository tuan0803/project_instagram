import fs from 'fs';
import path from 'path';
import MediaModel from '@models/medias';
import FileUploaderService from '@services/fileUploader';

class MediaController {
  public async create(userId: number, postId: number, mediaBuffer: Express.Multer.File) {
    try {
      const buffer = mediaBuffer.buffer || fs.readFileSync(mediaBuffer.path);
      const fileNameSource = mediaBuffer.originalname || mediaBuffer.name;
      const extension = path.extname(fileNameSource).toLowerCase();
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
      const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv'];
      let fileType;
      if (imageExtensions.includes(extension)) {
        fileType = 'image';
      } else if (videoExtensions.includes(extension)) {
        fileType = 'video';
      }
      const imageName = `${userId}_${Date.now()}_${extension}`;
      const url = await FileUploaderService.singleUpload(buffer, imageName);
      const result = await MediaModel.create({ postId, url, type: fileType });

      return result;
    }
    catch (error) {
      throw error;
    }
  }
}

export default new MediaController();