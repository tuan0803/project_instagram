
import fs from 'fs';
import path from 'path';

class FileUploaderService {
  static readonly STORAGE_PROVIDER = process.env.STORAGE_PROVIDER;

  public static async singleUpload (buffer: Buffer, fileName: string) {
    let path;
    switch (this.STORAGE_PROVIDER) {
      default: {
        path = await this.localUpload(buffer, fileName);
      }
    }
    return path;
  }

  private static localUpload (buffer: Buffer, fileName: string) {
    const uploadFolder = path.join(path.resolve('./'), 'public', 'upload');
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
  }
    fs.writeFileSync(path.join(uploadFolder, fileName), buffer);
    return path.join(uploadFolder, fileName);
  }
}

export default FileUploaderService;
