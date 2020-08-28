import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma-client';
@Injectable()
export class PrismaService {
  client: Prisma;

  constructor() {
    this.client = new Prisma({
      endpoint: 'https://hotelprismaserver.herokuapp.com'
    });
  }
}
