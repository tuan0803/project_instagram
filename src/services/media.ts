import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const UPLOADS_DIR = path.join(__dirname, '../uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

class MediaService {
  public async processAndSaveImage (buffer: Buffer, originalName: string): Promise<string> {
    try {
      const fileName = `processed-${Date.now()}-${originalName}`;
      const outputPath = path.join(UPLOADS_DIR, fileName);

      await sharp(buffer)
        .resize(800, 800, { fit: 'inside' })
        .toFile(outputPath);

      return fileName;
    } catch (error) {
      throw new Error('Lỗi khi xử lý ảnh');
    }
  }
}

export default new MediaService();
