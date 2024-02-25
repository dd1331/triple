import { Injectable } from '@nestjs/common';
import { FileService } from './file.service';

@Injectable()
export class LocalFileService implements FileService {
  async upload(file: Express.Multer.File): Promise<string> {
    try {
      const filePath = `sample/${Date.now()}-${file.originalname}`;
      // TODO:
      //   await fs.promises.writeFile(filePath, file.buffer);
      return filePath;
    } catch (err) {
      throw new Error(`Error while creating post: ${err.message}`);
    }
  }
}
