import { Module } from '@nestjs/common';
import { UploadController } from './FilesAndMockUpload';
import { AwsService } from 'src/aws/aws.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UploadController],
  providers: [AwsService, PrismaService],
})
export class UtilsModule {}
