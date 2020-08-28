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
          host : 'us1-devoted-eagle-31038.lambda.store',
          port : '31038',
          password: 'a12ca63c60714b60a1b01bb7299f193f',
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
