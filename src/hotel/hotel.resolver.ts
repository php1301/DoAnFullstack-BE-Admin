import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddHotelInput } from 'src/graphql.schema.generated';

@Resolver('Hotel')
export class HotelResolver {
  constructor(private readonly prisma: PrismaService) {}
  @Mutation()
//   Bóc data từ Input và gọi ORM.createHotel và gán cho các key trong model của prisma
  async createHotel(@Args('addHotelInput') { hotelName, contactNumber, title, price }: AddHotelInput) {
    return this.prisma.client.createHotel({
        // Của prisma
      hotelName, contactNumber, title, price
    });
  }
}
