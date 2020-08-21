import { Module } from '@nestjs/common';
import { UploadController } from './FilesAndMockUpload';
import { AwsService } from 'src/aws/aws.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from './stripe';

@Module({
  controllers: [UploadController],
  providers: [AwsService, PrismaService, StripeService],
  exports:[StripeService],
})
export class UtilsModule {}
