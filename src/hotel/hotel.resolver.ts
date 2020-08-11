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
  Reviews,
} from 'src/graphql.schema.generated';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { GqlUser } from 'src/shared/decorators/decorator';

@Resolver('Hotel')
export class HotelResolver {
  constructor(private readonly prisma: PrismaService) {}
  format = s =>
    s
      .toLowerCase()
      .split(/\s|%20/)
      .filter(Boolean)
      .join('-');

  // Các field được connect nhau thì cần resolve theo đúng id, để mutation và query return được subfield
  @ResolveField()
  async connectId(@Parent() { id }: Hotel) {
    // console.log(id);
    return this.prisma.client.hotel({ id }).connectId();
  }
  @ResolveField()
  async peopleLiked(@Parent() { id }: Hotel) {
    // console.log(id);
    return this.prisma.client.hotel({ id }).peopleLiked();
  }
  @ResolveField()
  async peopleReviewed(@Parent() { id }: Hotel) {
    return await this.prisma.client.hotel({ id }).peopleReviewed();
  }
  // Mẹo để có id resolve trong trường hợp parent - data trả về khác type - khai báo schema file thêm 1 field chứa id đó
  // Nếu schema đó có link:INLINE (chứa) thì ko cần
  @ResolveField()
  async reviews(@Parent() hotel: Hotel) {
    // Nếu vừa dùng cho cả query và mutation thì nên ráng bóc ra 1 cái stable từ cái id ta đã gán connect
    // const id = reviewedHotelId
    // const id = reviewedHotelId ? reviewedHotelId : user[0].reviewedHotelId;
    const id = hotel.id;
    // console.log(id);
    // Có thể ko cần ghi trong fragment field đã resolved
    const fragment = `fragment getUserInfoFromReview on User
    {
      reviewTitle
      reviewedHotelId
      reviewID
      reviewText
      peopleLiked {
        id
      }
      peopleDisliked {
        id
      }
      sortOfTrip
      reviewAuthorEmail
      reviewOverall
      reviewTips
      reviewAuthorPic
      reviewPics{
        url
      }
      reviewDate
      reviewOptional{
        option
        optionField
      }
      reviewFields{
        rating
        ratingFieldName
      }
      reviewAuthorFirstName
      reviewAuthorLastName
      reviewAuthorId
      {
        id
        first_name
        last_name
        username
        password
        email
        cellNumber
        profile_pic
        {
          id
          url
        }
        cover_pic
        {
          id
          url
        }
        date_of_birth
        gender
        content
        agent_location{
          id
          lat
          lng
          formattedAddress
          zipcode
          city
          state_long
          state_short
          country_long
          country_short
        }
        gallery
        {
          id
          url
        }
        social_profile{
          id
          facebook
          twitter
          linkedIn
          instagram
        }

        createdAt
        updatedAt
      }
    }`;
    // console.log(user[0].reviewedHotelId);
    return this.prisma.client
      .hotel({ id: id })
      .reviews({ orderBy: 'reviewDate_DESC' })
      .$fragment(fragment);
  }
  @ResolveField()
  async location(@Parent() { id }: Hotel) {
    // console.log('id tu con' + id);
    return this.prisma.client.hotel({ id }).location();
  }
  @ResolveField()
  async amenities(@Parent() { id }: Hotel) {
    return this.prisma.client.hotel({ id }).amenities();
  }
  @ResolveField()
  async image(@Parent() { id }: Hotel) {
    return this.prisma.client.hotel({ id }).image();
  }
  @ResolveField()
  async gallery(@Parent() { id }: Hotel) {
    return this.prisma.client.hotel({ id }).gallery();
  }
  @ResolveField()
  async categories(@Parent() { id }: Hotel) {
    return this.prisma.client.hotel({ id }).categories();
  }
  @Query()
  async locationId(@Args('id') id) {
    return this.prisma.client.location({ id });
  }
  @Query()
  async imageId(@Args('id') id) {
    return this.prisma.client.image({ id });
  }
  @Query()
  async galleryId(@Args('id') id) {
    return this.prisma.client.gallery({ id });
  }
  @Query()
  async categoryId(@Args('id') id) {
    return this.prisma.client.categories({ id });
  }
  @Query()
  async allAmenities() {
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
  async allCategories() {
    return this.prisma.client.categorieses();
  }
  @Query()
  async getHotelInfo(@Args('id') id) {
    return this.prisma.client.hotel({ id });
  }
  @Query()
  async getHotelReviews(@Args('id') id) {
    return this.prisma.client.hotel({ id }).reviews();
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
      rooms,
      // price,
      // hotelPhotos,
      locationDescription,
      contactNumber,
      wifiAvailability,
      airCondition,
      isNegotiable,
      propertyType,
      parking,
      poolAvailability,
      extraBed,
    }: AddHotelInput, // Có thể sử dụng Dto cho bớt dài dòng
    @Args('location')
    items: LocationInput[],
    @Args('image')
    imageItems: ImageInput[],
    @Args('categories')
    categoryItems: CategoriesInput[],
  ) {
    // console.log(user.id);
    // console.log(imageItems);
    const newHotel = await this.prisma.client.createHotel({
      // Của prisma
      agentId: user.id,
      connectId: {
        connect: {
          id: user.id,
        },
      },
      // Bind agentId vào user.id bằng connect
      agentEmail: user.email,
      agentName: user.first_name + ' ' + user.last_name,
      title: hotelName,
      slug: this.format(hotelName),
      content: hotelDetails,
      price: pricePerNight,
      isNegotiable,
      propertyType,
      termsAndCondition: locationDescription,
      contactNumber,
      amenities: {
        create: {
          guestRoom: guest,
          bedRoom: rooms,
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
          thumb_url: imageItems[1] ? imageItems[1].url : imageItems[0].url,
        },
      },
      location: {
        create: items,
      },
      gallery: {
        create: imageItems,
      },
      // 2 có 1 field con là object (cấp 3 hoặc array)
      // categories: {
      //   create: categoryItems.map(i => ({
      //     slug: i.slug,
      //     name: i.name,
      //     image: {
      //       create: i.image,
      //     },
      //   })),
      // },
    });
    return newHotel;
  }
}
