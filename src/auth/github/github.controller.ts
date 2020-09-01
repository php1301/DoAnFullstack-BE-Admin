import { Controller, Post, Res, Body } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import * as superagent from 'superagent';
import * as jwt2 from 'jsonwebtoken';
// Vì passport cho github strategy còn hạn chế nên làm theo express style
@Controller('github')
export class GithubController {
  constructor(private readonly prisma: PrismaService) {}
  @Post('callback')
  async githubAuth(@Body() code, @Res() res: Response) {
    try {
      console.log(code);
      const accessToken = await superagent
        .post('https://github.com/login/oauth/access_token')
        .send({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code.code,
        })
        .set('Accept', 'application/json');
      const userTokenRequest = accessToken.body.access_token;
      const userPayload = await superagent
        .get('https://api.github.com/user')
        .set('user-agent', 'github') // docs bảo bắt buộc mọi req đén api.github.com phải có header user-agent
        .set('Authorization', `Bearer ${userTokenRequest}`); //request bằng header Authorization
      const userEmails = await superagent //1 số users hide github email, phải get riêng
        .get('https://api.github.com/user/emails')
        .set('user-agent', 'github') // docs bảo bắt buộc mọi req đén api.github.com phải có header user-agent
        .set('Authorization', `Bearer ${userTokenRequest}`); //request bằng header Authorization
      const userInfo = userPayload.body;
      const user = await this.prisma.client.user({
        email: userEmails.body[0].email,
      });
      if (user) {
        const jwt = jwt2.sign(
          {
            id: user.id,
            name: user.first_name,
            accessToken,
          },
          process.env.JWT_SECRET,
        );
        res.cookie('token', jwt, {
          domain: '.hotel-prisma.vercel.app',
          httpOnly: false,
          sameSite: 'none',
          secure: true,
        });
        const userSendToClient = {
          first_name: user.first_name,
          last_name: user.last_name,
          cover_pic_main: user.cover_pic_main,
          profile_pic_main: user.profile_pic_main,
          email: user.email,
          id: user.id,
          role: user.role,
        };
        res.status(200).json({ userSendToClient });
        return user;
      }
      //   userEmails.body.map(async i => {
      //     console.log(i.email);
      //   });
      const userCreated = await this.prisma.client.createUser({
        first_name: userInfo.login,
        last_name: '',
        password: uuidv4(),
        username: userInfo.node_id,
        content: userInfo.bio || 'Nothing',
        email: userEmails.body[0].email,
        profile_pic_main: userInfo.avatar_url,
        cover_pic_main: 'https://i.imgur.com/lXybeGM.png',
        role: 'Normal',
      });
      const jwt = jwt2.sign(
        {
          id: userCreated.id,
          name: userCreated.first_name,
          accessToken,
        },
        process.env.JWT_SECRET,
      );
      res.cookie('token', jwt, {
        domain: '.hotel-prisma.vercel.app',
        httpOnly: false,
        sameSite: 'none',
        secure: true,
      });
      const userSendToClient = {
        first_name: userCreated.first_name,
        last_name: userCreated.last_name,
        cover_pic_main: userCreated.cover_pic_main,
        profile_pic_main: userCreated.profile_pic_main,
        email: userCreated.email,
        id: userCreated.id,
        role: userCreated.role,
      };
      res.status(200).json({ userSendToClient });
      return userCreated;
    } catch (e) {
      console.log(e);
    }
  }
}
