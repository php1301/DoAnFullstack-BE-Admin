import * as bcrypt from 'bcryptjs';
import * as jwt2 from 'jsonwebtoken';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginInput, User, UpdatePassword } from 'src/graphql.schema.generated';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ResGql, GqlUser } from 'src/shared/decorators/decorator';
import { SignUpInputDto } from './sign-up-input.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './graphql-auth.guard';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation()
  async login(
    @Args('loginInput') { email, password }: LoginInput,
    @ResGql() res: Response,
  ) {
    const user = await this.prisma.client.user({ email });
    if (!user) {
      throw Error('Email or password is incorrect');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw Error('Password is incorrect');
    }
    console.log("this is new");
    console.log(process.env.JWT_SECRET);
    const jwt = jwt2.sign(
      {
        id: user.id,
        name: user.first_name + ' ' + user.last_name,
        roles: 'user',
      },
      process.env.JWT_SECRET,
    );
    console.log(jwt)
    console.log("jwt")
    res.cookie('token', jwt, { httpOnly: true, sameSite:"none", secure:true });
    return user;
  }
  @Mutation()
  async facebookLogin(
    @Args('email') email,
    @Args('accessToken') accessToken,
    @Args('socialInfo') socialInfo,
    @Args('socialId') socialId,
    @Args('socialProfileLink') socialProfileLink,
    @ResGql() res: Response,
  ) {
    // Có thể thêm biến type để tạo nhiều dạng social như google, github,...
    const user = await this.prisma.client.user({ email });
    const profile_pic_main = `http://graph.facebook.com/${socialId}/picture?width=200&height=200`;
    if (!user) {
      const socialUser = await this.prisma.client.createUser({
        email,
        username: socialId,
        first_name: socialInfo,
        last_name: '',
        password: uuidv4(),
        profile_pic_main,
        cover_pic_main: 'https://i.imgur.com/lXybeGM.png',
        social_profile: {
          create: {
            facebook: socialProfileLink,
          },
        },
        role: 'Normal',
        // username: signUpInputDto.username,
      });
      const jwt = jwt2.sign(
        {
          id: socialUser.id,
          name: socialUser.first_name,
          accessToken,
        },
        process.env.JWT_SECRET,
      );
      res.cookie('token', jwt, { httpOnly: true, sameSite:"none", secure:true });
      return socialUser;
    }
    // sign JWT hợp lệ
    // Việc jwt.verify là optional nhờ vào decorator GqlUser()
    const jwt = jwt2.sign(
      {
        id: user.id,
        name: user.first_name,
        accessToken,
      },
      process.env.JWT_SECRET,
    );
    res.cookie('token', jwt, { httpOnly: true, sameSite:"none", secure:true });
    return user;
  }
  @Mutation()
  async googleLogin(
    @Args('email') email,
    @Args('accessToken') accessToken,
    @Args('socialInfo') socialInfo,
    @Args('socialId') socialId,
    @Args('profileImage') profileImage,
    @ResGql() res: Response,
  ) {
    // Có thể thêm biến type để tạo nhiều dạng social như google, github,...
    const user = await this.prisma.client.user({ email });
    if (!user) {
      const socialUser = await this.prisma.client.createUser({
        email,
        username: socialId,
        first_name: socialInfo,
        last_name: '',
        password: uuidv4(),
        profile_pic_main: profileImage.replace('s96-c', 's250-c'),
        cover_pic_main: 'https://i.imgur.com/lXybeGM.png',
        role: 'Normal',
        // username: signUpInputDto.username,
      });
      const jwt = jwt2.sign(
        {
          id: socialUser.id,
          name: socialUser.first_name,
          accessToken,
        },
        process.env.JWT_SECRET,
      );
      res.cookie('token', jwt, { httpOnly: true, sameSite:"none", secure:true});
      return socialUser;
    }
    // sign JWT hợp lệ
    // Việc jwt.verify là optional nhờ vào decorator GqlUser()
    const jwt = jwt2.sign(
      {
        id: user.id,
        name: user.first_name,
        accessToken,
      },
      process.env.JWT_SECRET,
    );
    res.cookie('token', jwt, { httpOnly: true, sameSite:"none", secure:true });
    return user;
  }
  @Mutation()
  async signup(
    // DTO file eli5: Extends các field của class và gắn thêm các thuộc tính layer
    // Ở đây dùng để validate, rằng buộc type password
    @Args('signUpInput') signUpInputDto: SignUpInputDto,
    @ResGql() res: Response,
  ) {
    const emailExists = await this.prisma.client.$exists.user({
      email: signUpInputDto.email,
    });
    if (emailExists) {
      throw Error('Email is already in use');
    }

    // Validate bằng username thì uncomment dòng dưới

    // const userExists = this.prisma.client.$exists.user({
    //   username: signUpInputDto.username,
    // });

    // if (userExists) {
    //   console.log(signUpInputDto.username)
    //   throw Error('Username is already in use');
    // }
    if (!signUpInputDto.username) {
      throw Error('username only contain alphabet letters or numbers');
    }
    const password = await bcrypt.hash(signUpInputDto.password, 10);
    const user = await this.prisma.client.createUser({
      ...signUpInputDto,
      password,
      first_name: signUpInputDto.first_name,
      last_name: signUpInputDto.last_name,
      role: 'Normal',
      // username: signUpInputDto.username,
    });
    console.log(process.env.JWT_SECRET);
    const jwt = jwt2.sign(
      {
        id: user.id,
        name: user.first_name + ' ' + user.last_name,
        roles: 'user',
      },
      process.env.JWT_SECRET,
    );
    res.cookie('token', jwt, { httpOnly: true, sameSite:"none", secure:true });
    return user;
  }
  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updatePassword(
    @GqlUser() user: User,
    @Args('password')
    { oldPassword, confirmPassword, newPassword }: UpdatePassword, // @ResGql() res: Response,
  ) {
    const userValid = await this.prisma.client.user({ id: user.id });
    if (!userValid) {
      throw Error('Must login');
    }

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      throw Error('Old Password is not right');
    }
    if (newPassword === oldPassword) {
      throw Error('New Password and Old Password field must be different');
    }
    if (confirmPassword !== newPassword) {
      console.log('false');
      throw Error('Password Confirm and New Password field must be the same');
    }
    const password = await bcrypt.hash(newPassword, 10);
    console.log('hashed ' + password);
    // const jwt = jwt2.sign(
    //   {
    //     id: user.id,
    //     name: user.first_name + ' ' + user.last_name,
    //     roles: 'user',
    //   },
    //   process.env.JWT_SECRET,
    // );
    // res.cookie('token', jwt, { httpOnly: true });
    return this.prisma.client.updateUser({
      where: {
        id: user.id,
      },
      data: {
        password,
      },
    });
  }
  @Mutation()
  async changePasswordFromForgetPassword(
    @Args('password') password,
    @Args('email') email,
    @ResGql() res: Response,
  ) {
    try {
      const userValid = await this.prisma.client.user({ email });
      if (!userValid) {
        throw Error('Invalid user');
      }

      const newPassword = await bcrypt.hash(password, 10);
      const updatedUser = await this.prisma.client.updateUser({
        where: {
          email,
        },
        data: {
          password: newPassword,
        },
      });
      const jwt = jwt2.sign(
        {
          id: updatedUser.id,
          name: updatedUser.first_name,
          roles: 'user',
        },
        process.env.JWT_SECRET,
      );
      res.clearCookie('reset-password');
      // res.cookie('token', jwt, { httpOnly: false });
      return updatedUser;
    } catch (e) {
      console.log(e);
    }
  }
}
