import { Module, ValidationPipe } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlOptions } from './graphql.options';
import { AppController } from './app.controller';
import { HotelModule } from './hotel/hotel.module';
import { AuthModule } from './auth/auth.module';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

// document cho mail https://nest-modules.github.io/mailer/docs/mailer.html
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

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
          adapter: new PugAdapter(), // or new PugAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
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
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
