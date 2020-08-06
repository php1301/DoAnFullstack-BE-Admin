import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { AwsService } from 'src/aws/aws.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';

@Controller('api')
export class UploadController {
  constructor(private aws: AwsService) {}
  @Post('uploadFile')
  @UseInterceptors(FilesInterceptor('files[]'))
  async uploadFile(@UploadedFiles() files) {
    // console.log(files)
    return await this.aws.uploadFile(files);
  }
  @Post('mock')
  async mock(@Body() receivedMockData: string[]) {
    console.log(receivedMockData);
    fs.writeFile('mock.ts', JSON.stringify(receivedMockData, null, 4), err => {
      if (err) throw err;
    });
    console.log('MockData exported');
    // Có thể viết class lấy hàm như aws làm hoặc execute prisma seed
  }
}
