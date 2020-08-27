import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { FacebookStrategy } from './facebook.strategy';
import { GoogleStrategy } from './google.strategy';
import { GithubController } from './github/github.controller';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      privateKey: process.env.JWT_SECRET,
      secretOrPrivateKey: process.env.JWT_SECRET,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 3600, //1 giờ
      },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, FacebookStrategy, GoogleStrategy],
  controllers: [GithubController],
})
export class AuthModule {}
