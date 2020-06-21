import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/graphql.schema.generated';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async validate({ id }): Promise<User> {
    const user = await this.prisma.client.user({ id });
    if (!user) throw Error('Authenticate validation error');
    return user
  }
//   Check có user ko bằng cách find Id
}
