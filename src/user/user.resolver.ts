import {
  Resolver,
  ResolveField,
  Parent,
  Args,
  Query,
  Mutation,
} from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  User,
  Hotel,
  UpdatePhotosInput,
  UpdatePassword,
} from 'src/graphql.schema.generated';
import {
  UpdateProfileInput,
  LocationInput,
  ContactInput,
} from 'src/graphql.schema.generated';
import { GqlUser } from 'src/shared/decorators/decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { MailService } from 'src/services/sendEmail';
import { ID_Input } from 'generated/prisma-client';
@Resolver('User')
export class UserResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}
  @ResolveField()
  async agent_location(@Parent() { id }: User) {
    return this.prisma.client.user({ id }).agent_location();
  }
  @ResolveField()
  async cover_pic(@Parent() { id }: User) {
    return this.prisma.client.user({ id }).cover_pic();
  }
  @ResolveField()
  async profile_pic(@Parent() { id }: User) {
    return this.prisma.client.user({ id }).profile_pic();
  }

  // Tương tự populate trong express
  // Trả về parent tương ứng của User.listed_posts
  // @UseGuards(GqlAuthGuard
  @ResolveField()
  async listed_posts(@Parent() user: Hotel[]) {
    // Chú ý các quan hệ N-1, 1-N
    // listed_posts bi populated, gán listed_posts vào model nó kế thừa
    // Mẹo cho các field là mảng - nested object
    // nên log ra data để biết đang loại data gì
    // nên connect dựa vào id hay gì để có thể lợi dụng id đó query đúng
    const id = user[0].agentId;
    console.log(id);
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
    return await this.prisma.client
      .user({ id: id })
      .listed_posts()
      .$fragment(fragment);
  }

  @Query()
  async userPosts(@Args('id') id) {
    // console.log(id);
    return this.prisma.client.user({ id }).listed_posts();
  }
  @Query()
  async getUserInfo(@Args('id') id) {
    return this.prisma.client.user({ id });
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async likeHotel(@GqlUser() user: User, @Args('id') id: ID_Input) {
    console.log(id);
    return this.prisma.client.updateHotel({
      where: {
        id,
      },
      data: {
        peopleLiked: {
          connect: { id: user.id },
        },
      },
    });
  }
  @Mutation()
  @UseGuards(GqlAuthGuard)
  async dislikeHotel(@GqlUser() user: User, @Args('id') id: ID_Input) {
    console.log(id);
    return this.prisma.client.updateHotel({
      where: {
        id,
      },
      data: {
        peopleLiked: {
          disconnect: { id: user.id },
        },
      },
    });
  }
  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updateProfile(
    @GqlUser() user: User,
    @Args('profile')
    {
      first_name,
      last_name,
      date_of_birth,
      gender,
      email,
      content,
      cellNumber,
    }: UpdateProfileInput,
    @Args('location')
    locationInput: LocationInput,
  ) {
    return await this.prisma.client.updateUser({
      where: {
        id: user.id,
      },
      data: {
        first_name,
        last_name,
        date_of_birth,
        gender,
        email,
        content,
        cellNumber,
        agent_location: {
          create: {
            ...locationInput,
          },
        },
      },
    });
  }
  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updatePhotos(
    @GqlUser() user: User,
    @Args('photos') { cover_pic, profile_pic }: UpdatePhotosInput,
  ) {
    return this.prisma.client.updateUser({
      where: {
        id: user.id,
      },
      data: {
        // cover_pic: {
        //   create: photos.map(i => ({
        //     url: i.cover_pic.url,
        //   })),
        // },
        // profile_pic: {
        //   create: photos.map(i => ({
        //     url: i.profile_pic.url,
        //   })),
        // },
        cover_pic: {
          create: cover_pic.map(i => ({
            url: i.url,
          })),
        },
        profile_pic: {
          create: profile_pic.map(i => ({
            url: i.url,
          })),
        },
      },
    });
  }
  @Mutation()
  @UseGuards(GqlAuthGuard)
  async sendContact(
    @GqlUser() user: User,
    @Args('contact') { email, message, cellNumber, targetEmail }: ContactInput,
  ) {
    return this.mailService.sendContact(
      email,
      message,
      cellNumber,
      targetEmail,
    );
  }
  @Mutation()
  async forgetPassword(@Args('email') email: string) {
    console.log('Email input is ' + email);
    const user = this.prisma.client.$exists.user({ email });
    if (!user) {
      throw Error('Email not exists');
    }
    return this.mailService.sendEmail(email);
  }
}
