import * as bcrypt from 'bcryptjs';
import * as jwt2 from 'jsonwebtoken';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginInput } from 'src/graphql.schema.generated';
import { Response } from 'express';
import { ResGql } from 'src/shared/decorators/decorator';
import { SignUpInputDto } from './sign-up-input.dto';

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
      throw Error('Email or password incorrect');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw Error('Email or password incorrect');
    }

    const jwt = jwt2.sign(
      {
        id: user.id,
        name: user.first_name + ' ' + user.last_name,
        roles: 'user',
      },
      process.env.JWT_SECRET,
    );
    res.cookie('token', jwt, { httpOnly: true });
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

    const userExists = this.prisma.client.$exists.user({
      username: signUpInputDto.username,
    });
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
    console.log(jwt);
    res.cookie('token', jwt, { httpOnly: true });
    return user;
  }
}
