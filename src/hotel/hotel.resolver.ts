import {
  Resolver,
  Mutation,
  Args,
  ResolveProperty,
  Parent,
  Query,
} from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddHotelInput,
  LocationInput,
  ImageInput,
  CategoriesInput,
} from 'src/graphql.schema.generated';

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

  @Mutation()
  //   Bóc data từ Input và gọi ORM.createHotel và gán cho các key trong model của prisma
  async createHotel(
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
    const newHotel = await this.prisma.client.createHotel({
      // Của prisma
      title: hotelName,
      slug: this.format(hotelName),
      content: hotelDetails,
      status: true,
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
    return newHotel
  }
  // @ResolveProperty()
  // async location(@Parent() { id }: Hotel) {
  //   return this.prisma.client.hotel({ id }).location;
  // }
}
