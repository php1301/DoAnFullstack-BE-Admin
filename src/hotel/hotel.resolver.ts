import {
  Resolver,
  Mutation,
  Args,
  Parent,
  Query,
  ResolveField,
} from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddHotelInput,
  LocationInput,
  ImageInput,
  CategoriesInput,
  User,
  Hotel,
} from 'src/graphql.schema.generated';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { GqlUser } from 'src/shared/decorators/decorator';

@Resolver('Hotel')
export class HotelResolver {
  constructor(private readonly prisma: PrismaService) {}
  format = (s: string) =>
    s
      .toLowerCase()
      .split(/\s|%20/)
      .filter(Boolean)
      .join('-');

  @Query()
  async location(@Args('id') id: string) {
    return this.prisma.client.location({ id });
  }
  @Query()
  async image(@Args('id') id: string) {
    return this.prisma.client.image({ id });
  }
  @Query()
  async gallery(@Args('id') id: string) {
    return this.prisma.client.gallery({ id });
  }
  @Query()
  async category(@Args('id') id: string) {
    return this.prisma.client.categories({ id });
  }
  @Query()
  async amenities() {
    return this.prisma.client.amenitieses();
  }
  @Query()
  async locations() {
    return this.prisma.client.locations();
  }
  @Query()
  async galleries() {
    return this.prisma.client.galleries();
  }
  @Query()
  async categories() {
    return this.prisma.client.categorieses();
  }
  // Các field được connect nhau thì cần resolve theo đúng id, xử lý return mutation field agentId
  @ResolveField()
  async connectId(@Parent() { id }: Hotel) {
    console.log(id);
    return this.prisma.client.hotel({ id }).connectId();
  }
  @Mutation()
  //   Bóc data từ Input và gọi ORM.createHotel và gán cho các key trong model của prisma
  @UseGuards(GqlAuthGuard)
  async createHotel(
    @GqlUser() user: User,
    @Args('addHotelInput')
    {
      hotelName,
      pricePerNight,
      hotelDetails,
      guest,
      beds,
      // price,
      // hotelPhotos,
      locationDescription,
      contactNumber,
      wifiAvailability,
      airCondition,
      parking,
      poolAvailability,
      extraBed,
    }: AddHotelInput,
    @Args('location')
    items: LocationInput[],
    @Args('image')
    imageItems: ImageInput[],
    @Args('categories')
    categoryItems: CategoriesInput[],
  ) {
    console.log(user.id);
    const newHotel = await this.prisma.client.createHotel({
      // Của prisma
      agentId: user.id,
      connectId: {
        connect: {
          id: user.id,
        },
      },
      // Bind agentId vào user.id bằng connect
      title: hotelName,
      slug: this.format(hotelName),
      content: hotelDetails,
      price: pricePerNight,
      isNegotiable: true,
      termsAndCondition: locationDescription,
      contactNumber,
      amenities: {
        create: {
          guestRoom: guest,
          bedRoom: beds,
          wifiAvailability,
          airCondition,
          parkingAvailability: parking,
          poolAvailability,
          extraBedFacility: extraBed,
        },
      },
      image: {
        create: {
          url: imageItems[0].url,
          thumb_url: imageItems[1].url,
        },
      },
      location: {
        create: items,
      },
      gallery: {
        create: imageItems,
      },
      // 2 có 1 field con là object (cấp 3 hoặc array)
      categories: {
        create: categoryItems.map(i => ({
          slug: i.slug,
          name: i.name,
          image: {
            create: i.image,
          },
        })),
      },
    });
    return newHotel;
  }
}
