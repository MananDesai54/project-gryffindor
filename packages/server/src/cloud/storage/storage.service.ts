import { Storage } from '@google-cloud/storage';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class StorageService {
  private readonly storage: Storage;
  private readonly bucketName: string;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_KEY_FILE_PATH,
    });
    this.bucketName = process.env.GCS_BUCKET_NAME;
  }

  async uploadFiles(files: Express.Multer.File[]) {
    return Promise.all(files.map((file) => this.uploadFile(file)));
  }

  async uploadFile(file: Express.Multer.File) {
    const bucket = this.storage.bucket(this.bucketName);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const uniqueFileName = `${Date.now()}-${file.originalname}`;

    const blob = bucket.file(uniqueFileName);

    return new Promise((res, reject) => {
      const blobStream = blob.createWriteStream({
        resumable: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        contentType: file.mimetype,
      });

      blobStream.on('error', (error) => {
        Logger.error('[Cloud Storage Upload Error]', error);
        reject(new InternalServerErrorException(error));
      });

      blobStream.on('finish', () => {
        res({
          url: `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`,
        });
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      blobStream.end(file.buffer);
    });
  }
}
