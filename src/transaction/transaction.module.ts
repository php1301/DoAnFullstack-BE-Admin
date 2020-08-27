import { Module } from '@nestjs/common';
import { TransactionResolver } from './transaction.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailService } from 'src/services/sendEmail';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as Redis from 'ioredis';
@Module({
  providers: [
    TransactionResolver,
    MailService,
    {
      provide: 'PUB_SUB',
      useFactory: () => {
        const options = {
          host: 'localhost',
          port: 6379,
        };
        return new RedisPubSub({
          publisher: new Redis(options),
          subscriber: new Redis(options),
        });
      },
      // useValue: new PubSub(),
    },
  ],
  imports: [PrismaModule],
})
export class TransactionModule {}
