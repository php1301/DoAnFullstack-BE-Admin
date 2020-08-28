import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma-client';
@Injectable()
export class PrismaService {
  client: Prisma;

  constructor() {
    this.client = new Prisma({
      endpoint: 'https://hotel-prisma-2-7b9f4279d9.herokuapp.com'
    });
  }
}
