import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  public async uploadFile(file: any): Promise<any> {
    const urlArray = [];
    // console.log( file);
    const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    });
    await file.map(async (file, i: number) => {
      const urlKey = `filePath/${file.originalname}`;
      const params = {
        Body: file.buffer,
        Bucket: AWS_S3_BUCKET_NAME,
        Key: urlKey,
        ACL: 'public-read',
      };
      // console.log(params);

      // getSignedUrl chỉ có callback, có thể convert thành Promise như cách dưới
      // Hoặc xài package bluebird
      const url = new Promise((resolve, reject) => {
        s3.getSignedUrl('putObject', params, (err, data) => {
          if (err) {
            console.log(err);
            reject(err);
            // res.json({success: false, error: err})
          }
          const returnData = {
            // Có thể xài lib uuid()
            uid: `${file.originalname}-${file.size - i}`,
            signedRequest: data,
            url: `https://${AWS_S3_BUCKET_NAME}.s3.amazonaws.com/filePath/${file.originalname}`,
          };
          resolve(returnData);
        });
      });
      urlArray.push(url);

      // Upload lên aws
      const data = await s3
        .putObject(params)
        .promise()
        .then(
          data => {
            return urlKey;
          },
          err => {
            console.log(err);
            return err;
          },
        );
    });
    return Promise.all(urlArray).then(r => r);
  }
}
