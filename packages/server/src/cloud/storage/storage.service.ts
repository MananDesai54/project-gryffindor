import { Storage } from '@google-cloud/storage';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UploadedFile } from 'src/file/type/file.type';

@Injectable()
export class StorageService {
  private readonly storage: Storage;
  private readonly bucketName: string;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GCS_PROJECT_ID,
      credentials: {
        type: process.env.GCS_CRED_TYPE,
        project_id: process.env.GCS_PROJECT_ID,
        private_key_id: process.env.GCS_PRIVATE_KEY_ID,
        private_key: process.env.GCS_PRIVATE_KEY,
        client_email: process.env.GCS_CLIENT_EMAIL,
        client_id: process.env.GCS_CLIENT_ID,
        universe_domain: process.env.GCS_UNIVERSE_DOMAIN,
      },
    });
    this.bucketName = process.env.GCS_BUCKET_NAME;
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<UploadedFile[]> {
    return Promise.all(files.map((file) => this.uploadFile(file)));
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadedFile> {
    const bucket = this.storage.bucket(this.bucketName);
    const uniqueFileName = `${Date.now()}-${file.originalname}`;

    const blob = bucket.file(uniqueFileName);

    return new Promise((res, reject) => {
      const blobStream = blob.createWriteStream({
        resumable: true,
        contentType: file.mimetype,
      });

      blobStream.on('error', (error) => {
        Logger.error('[Cloud Storage Upload Error]', error);
        reject(new InternalServerErrorException(error));
      });

      blobStream.on('finish', () => {
        res({
          url: `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`,
          mimeType: file.mimetype,
        });
      });

      blobStream.end(file.buffer);
    });
  }
}
