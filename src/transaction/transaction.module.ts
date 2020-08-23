import { Module } from '@nestjs/common';
import { TransactionResolver } from './transaction.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailService } from 'src/services/sendEmail';

@Module({
  providers: [TransactionResolver, MailService],
  imports: [PrismaModule],
})
export class TransactionModule {}
