import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
// import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlOptions } from './graphql.options';
import { AppController } from './app.controller';
import { HotelModule } from './hotel/hotel.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useClass: GraphqlOptions,
    }),
    PrismaModule,
    HotelModule,
    // UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
