import { Module, ValidationPipe } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlOptions } from './graphql.options';
import { AppController } from './app.controller';
import { HotelModule } from './hotel/hotel.module';
import { AuthModule } from './auth/auth.module';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './user/user.module';
// import { PubSub } from 'graphql-subscriptions';
// import { RedisPubSub } from 'graphql-redis-subscriptions';
// import * as Redis from 'ioredis';
// document cho mail https://nest-modules.github.io/mailer/docs/mailer.html
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { AwsService } from './aws/aws.service';
import { UtilsModule } from './utils/utils.module';
import { TransactionModule } from './transaction/transaction.module';
import { StripeService } from './utils/stripe';
import { CronService } from './cron/cron.service';
import { CronModule } from './cron/cron.module';
import { MailService } from './services/sendEmail';

// Để validation work xuyên suốt app thì phải provide validation pipe
@Module({
  imports: [
    // Bất đồng bộ, xài forRoot sẽ dính lỗi Plain => do auth ko lấy dc .env
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // upgrade later with STARTTLS
          auth: {
            user: process.env.LOCAL_EMAIL,
            pass: process.env.LOCAL_PASSWORD,
          },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          // dir: process.cwd() + '/templates/',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: './.env',
    }),
    GraphQLModule.forRootAsync({
      useClass: GraphqlOptions,
    }),
    PrismaModule,
    HotelModule,
    AuthModule,
    UserModule,
    UtilsModule,
    TransactionModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    MailService,
    AwsService,
    StripeService,
    CronService,
  ],
})
export class AppModule {}
