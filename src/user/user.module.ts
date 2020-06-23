import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailService } from 'src/services/sendEmail';

@Module({
  providers: [UserResolver, MailService],
  imports: [PrismaModule],
})
export class UserModule {}
