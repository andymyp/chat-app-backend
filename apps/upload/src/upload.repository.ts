import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class UploadRepository {
  private bucketname: string;

  constructor(private configService: ConfigService) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
        clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        privateKey: this.configService
          .get<string>('FIREBASE_PRIVATE_KEY')
          .replace(/\\n/g, '\n'),
      }),
      storageBucket: this.configService.get<string>('FIREBASE_STORAGE_BUCKET'),
    });

    this.bucketname = this.configService.get<string>('FIREBASE_STORAGE_BUCKET');
  }

  async upload(
    file: Express.Multer.File,
    folder: string,
    name: string,
  ): Promise<string> {
    const bucket = admin.storage().bucket();

    const filename = `${folder}/${name}`;
    const fileUpload = bucket.file(filename);

    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${this.bucketname}/o/${encodeURIComponent(filename)}?alt=media`;
    return fileUrl;
  }

  async delete(folder: string, name: string) {
    const bucket = admin.storage().bucket();
    const filename = `${folder}/${name}`;

    const deleted = await bucket.file(filename).delete();
    return deleted;
  }
}
