import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { uuid } from 'uuidv4';

@Injectable()
export class UploadService {
  s3: S3Client;
  bucketName = process.env.AWS_BUCKET_NAME;
  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, key: string) {
    const params = {
      Bucket: this.bucketName,
      Key: 'uploads/' + uuid() + key.replace(/ /g, '_'),
      Body: file.buffer,
    };
    try {
      await this.s3.send(new PutObjectCommand(params));
      return `https://${this.bucketName}.s3.amazonaws.com/${params.Key}`;
    } catch (error) {
      console.error(error);
    }
  }
}
