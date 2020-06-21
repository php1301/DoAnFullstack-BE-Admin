import { Resolver, ResolveField, Parent, Args, Query } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/graphql.schema.generated';

@Resolver('User')
export class UserResolver {
  constructor(private readonly prisma: PrismaService) {}
  @ResolveField()
  // Tương tự populate trong express
  // Trả về parent tương ứng của User.listed_posts
  async listed_posts(@Parent() { id }: User) {
    const fragment = `fragment Somefrag on User
    {
      
      title
      content
      slug
      price
      status
      isNegotiable
      propertyType
      condition
      contactNumber
      termsAndCondition
      amenities{
        id
        guestRoom
        bedRoom
        wifiAvailability
        parkingAvailability
        poolAvailability
        airCondition
        extraBedFacility
      }
      image{
        url
      }
      location{
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
      gallery{
        url
      }
      categories{
        id
        slug
        name
        image
        {
          id
          url
        }
      }
      createdAt
      updatedAt
    }`;
    return await this.prisma.client.hotels().$fragment(fragment);
  }
  @Query()
  async userPosts(@Args('id') id) {
    console.log(id);
    return this.prisma.client.user({ id }).listed_posts();
  }
}
