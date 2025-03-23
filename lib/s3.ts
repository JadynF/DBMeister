import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: 'nyc3', // Change to your region
  endpoint: process.env.CUSTOMIMG_SPACES_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CUSTOMIMG_SPACES_KEY_ID as string,
    secretAccessKey: process.env.CUSTOMIMG_SPACES_SECRET_KEY as string,
  }
});
console.log("Connected to cloud storage!");
