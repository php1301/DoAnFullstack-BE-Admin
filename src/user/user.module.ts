import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailService } from 'src/services/sendEmail';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as Redis from 'ioredis';
@Module({
  providers: [
    UserResolver,
    MailService,
    {
      provide: 'PUB_SUB',
      useFactory: () => {
        const options = {
          host: 'redis',
          port: 6379,
          password: 'no',
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
export class UserModule {}
