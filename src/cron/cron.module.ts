import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailService } from 'src/services/sendEmail';
@Module({
  providers: [MailService],
  imports: [PrismaModule],
})
export class CronModule {}
