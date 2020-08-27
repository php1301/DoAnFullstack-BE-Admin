import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as FacebookTokenStrategy from 'passport-facebook-token';
import { AuthService } from './auth.service';
import { config } from 'dotenv';
config();
@Injectable()
export class FacebookStrategy extends PassportStrategy(
  FacebookTokenStrategy,
  'facebook-token',
) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_SECRET_KEY,
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    try {
      console.log(accessToken);
      console.log(`Got a profile: `, profile);

      const jwt = 'placeholderJWT';
      const user = {
        jwt,
      };
      done(null, user);
      return this.authService.validate(profile);
    } catch (err) {
      console.log(`Got an error: `, err);
      done(err, false);
    }
  }
}
