export interface FileService {
  upload(file: Express.Multer.File): Promise<string>;
}
