import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma-client';
@Injectable()
export class PrismaService {
  client: Prisma;

  constructor() {
    this.client = new Prisma({
      endpoint: process.env.PRISMA_DOCKER || 'http://prisma:4466',
    });
  }
}
