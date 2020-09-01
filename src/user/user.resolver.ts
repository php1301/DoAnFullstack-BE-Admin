import {
  Resolver,
  ResolveField,
  Parent,
  Args,
  Query,
  Mutation,
  Subscription,
} from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import {
  User,
  Reviews,
  UpdatePhotosInput,
  ReviewInput,
  SocialInput,
  UpdateProfileInput,
  DeletePhotosInput,
  LocationInput,
  ContactInput,
  Unread,
  Notification,
  CouponInput,
} from 'src/graphql.schema.generated';
import { GqlUser, ResGql } from 'src/shared/decorators/decorator';
import { Inject, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { MailService } from 'src/services/sendEmail';
import { ID_Input } from 'generated/prisma-client';
import { PubSubEngine } from 'graphql-subscriptions';
import _ = require('lodash');
import { isMongoId } from 'class-validator';
@Resolver('User')
export class UserResolver {
  constructor(
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
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
  @ResolveField()
  async gallery(@Parent() { id }: User) {
    return this.prisma.client.user({ id }).gallery();
  }
  @ResolveField()
  async notification(@Parent() { id }: User) {
    return this.prisma.client
      .user({ id })
      .notification({ orderBy: 'createdAt_DESC' });
  }

  // Tương tự populate trong express
  // Parent chính là data type của object gần nhất nest khi query
  // Không ai nest thì parent data type là chính nó
  // Trả về parent tương ứng của User.listed_posts
  // @UseGuards(GqlAuthGuard
  @ResolveField()
  async social_profile(@Parent() { id }: User) {
    return this.prisma.client.user({ id }).social_profile();
  }
  // @ResolveField()
  // async listed_posts(@Parent() hotel: Hotel[], @Parent() user: User) {
  //   // Chú ý các quan hệ N-1, 1-N
  //   // listed_posts bi populated, gán listed_posts vào model nó kế thừa
  //   // Mẹo cho các field là mảng - nested object - dùng fragment
  //   // nên log ra data để biết đang loại data gì
  //   // nên connect dựa vào id hay gì để có thể lợi dụng id đó query đúng
  //   // Data trả về nhiều cấp nên log ra để biết của cái nào và check null
  //   console.log(user);
  //   const userId = (user && user.id) || (hotel[0] && hotel[0].agentId);
  //   // console.log(user);
  //   // first id fragment
  //   // console.log('id từ cha' + userId);
  //   const fragment = `fragment Somefrag on User
  //   {
  //     id
  //     title
  //     content
  //     slug
  //     price
  //     status
  //     isNegotiable
  //     propertyType
  //     condition
  //     contactNumber
  //     termsAndCondition
  //     rating
  //     ratingCount
  //     amenities{
  //       id
  //       guestRoom
  //       bedRoom
  //       wifiAvailability
  //       parkingAvailability
  //       poolAvailability
  //       airCondition
  //       extraBedFacility
  //     }
  //     image{
  //       id
  //       url
  //     }
  //     location{
  //       id
  //       lat
  //       lng
  //       formattedAddress
  //       zipcode
  //       city
  //       state_long
  //       state_short
  //       country_long
  //       country_short
  //     }
  //     gallery{
  //       id
  //       url
  //     }
  //     categories{
  //       id
  //       slug
  //       name
  //       image
  //       {
  //         id
  //         url
  //       }
  //     }
  //     createdAt
  //     updatedAt
  //   }`;
  //   return await this.prisma.client
  //     .user({ id: userId })
  //     .listed_posts()
  //     .$fragment(fragment);
  // }
  // @ResolveField()
  // async favourite_post(@Parent() hotel: Hotel[], @Parent() user: User) {
  //   const userId = (user && user.id) || (hotel[0] && hotel[0].agentId);
  //   const fragment = `fragment fragFavourite on User
  //   {
  //     id
  //     title
  //     content
  //     slug
  //     price
  //     status
  //     isNegotiable
  //     propertyType
  //     condition
  //     contactNumber
  //     termsAndCondition
  //     amenities{
  //       id
  //       guestRoom
  //       bedRoom
  //       wifiAvailability
  //       parkingAvailability
  //       poolAvailability
  //       airCondition
  //       extraBedFacility
  //     }
  //     image{
  //       url
  //     }
  //     location{
  //       id
  //       lat
  //       lng
  //       formattedAddress
  //       zipcode
  //       city
  //       state_long
  //       state_short
  //       country_long
  //       country_short
  //     }
  //     gallery{
  //       url
  //     }
  //     categories{
  //       id
  //       slug
  //       name
  //       image
  //       {
  //         id
  //         url
  //       }
  //     }
  //     createdAt
  //     updatedAt
  //   }`;
  //   return await this.prisma.client
  //     .user({ id: userId })
  //     .favourite_post()
  //     .$fragment(fragment);
  // }
  @ResolveField()
  async review_liked(@Parent() user: Reviews[]) {
    console.log(user);
  }
  @ResolveField()
  async review_disliked(@Parent() { id }: User) {
    console.log(id);
  }
  @Query()
  async userPosts(@Args('id') id: ID_Input) {
    const fragment = `fragment fragFavourite on User
      {
        listed_posts{
          id
          title
          content
          slug
          price
          status
          isNegotiable
          propertyType
          condition
          contactNumber
          rating
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
        }
        favourite_post{
        id
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
      }
    }`;
    return this.prisma.client.user({ id }).$fragment(fragment);
  }
  @Query()
  async favouritePosts(@Args('id') id) {
    return this.prisma.client.user({ id }).favourite_post();
  }
  @Query()
  async getUserGallery(@Args('id') id) {
    return this.prisma.client.user({ id }).gallery();
  }
  @UseGuards(GqlAuthGuard)
  @Query()
  async favouritePostsHeart(@Args('id') id, @GqlUser() user: User) {
    console.log(user.id);
    return await this.prisma.client.user({ id: user.id }).favourite_post({
      where: {
        id: id,
      },
    });
  }
  @Query()
  async getUserInfo(@Args('id') id) {
    return this.prisma.client.user({ id });
  }
  @Query()
  async getUserReviews(@Args('id') id) {
    return this.prisma.client.user({ id }).reviews_maked();
  }
  @Query()
  async getUserNotification(@Args('id') id) {
    return this.prisma.client
      .user({ id })
      .notification({ orderBy: 'createdAt_DESC' });
  }
  @Query()
  async getUserUnreadNotification(@Args('id') id) {
    const fragment = `fragment getUnreadNotificationNumber on User{
      unreadNotification
    }`;
    return this.prisma.client.user({ id }).$fragment(fragment);
  }
  @Query()
  async getReviewsLikeDislike(@Args('id') id) {
    const fragment = `fragment likeAndDislike on User{
      reviewID
      peopleLiked {
        id
      }
      peopleDisliked {
        id
      }
    }`;
    return this.prisma.client.reviews({ reviewID: id }).$fragment(fragment);
  }
  @Query()
  async getVendorStripeId(@Args('id') id) {
    const fragment = `fragment vendorStripeIdFrag on User{
      stripeId
    }`;
    return await this.prisma.client.user({ id }).$fragment(fragment);
  }
  @Mutation()
  @UseGuards(GqlAuthGuard)
  async likeHotel(@GqlUser() user: User, @Args('id') id) {
    console.log(user.id + 'OK');
    console.log(id);
    return await this.prisma.client.updateHotel({
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
  async dislikeHotel(@GqlUser() user: User, @Args('id') id) {
    console.log(user.id + 'dislike');
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
    @Args('social')
    socialInput: SocialInput,
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
        social_profile: {
          create: {
            ...socialInput,
          },
        },
      },
    });
  }
  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updatePhotos(
    @GqlUser() user: User,
    @Args('photos') url: UpdatePhotosInput[],
  ) {
    return await this.prisma.client.updateUser({
      where: {
        id: user.id,
      },
      data: {
        gallery: {
          create: url,
        },
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
        // profile_pic_main: profile_pic[0].url,
        // cover_pic: {
        //   create: cover_pic.map(i => ({
        //     url: i.url,
        //   })),
        // },
        // profile_pic: {
        //   create: profile_pic.map(i => ({
        //     url: i.url,
        //   })),
        // },
      },
    });
  }
  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deletePhotos(
    @GqlUser() user: User,
    @Args('photos') id: DeletePhotosInput[],
  ) {
    console.log(id);
    id.map(async i => {
      return await this.prisma.client.updateUser({
        where: {
          id: user.id,
        },
        data: {
          gallery: {
            delete: {
              id: i.id,
            },
          },
        },
      });
    });
  }
  @Mutation()
  @UseGuards(GqlAuthGuard)
  async setProfilePic(@GqlUser() user: User, @Args('url') url) {
    return this.prisma.client.updateUser({
      where: {
        id: user.id,
      },
      data: {
        profile_pic_main: url,
      },
    });
  }
  @Mutation()
  @UseGuards(GqlAuthGuard)
  async setCoverPic(@GqlUser() user: User, @Args('url') url) {
    return this.prisma.client.updateUser({
      where: {
        id: user.id,
      },
      data: {
        cover_pic_main: url,
      },
    });
  }
  @Mutation()
  @UseGuards(GqlAuthGuard)
  async sendContact(
    @GqlUser() user: User,
    @Args('contact') { message, cellNumber, subject }: ContactInput,
  ) {
    return this.mailService.sendContact(
      subject,
      user.email,
      message,
      cellNumber,
    );
  }
  @Mutation()
  @UseGuards(GqlAuthGuard)
  async likeOrDislikeReview(
    @GqlUser() user: User,
    @Args('id') id,
    @Args('type') type,
  ) {
    const checkUserLiked = await this.prisma.client.$exists.reviews({
      reviewID: id,
      peopleLiked_some: {
        id: user.id,
      },
    });
    const checkUserDisliked = await this.prisma.client.$exists.reviews({
      reviewID: id,
      peopleDisliked_some: {
        id: user.id,
      },
    });
    const fragment = `fragment likeAndDislikeRealtime on Reviews{
      reviewID
      peopleLiked{
        id
      }
      peopleDisliked{
        id
      }
    }`;
    // console.log('Check like');
    // console.log(checkUserLiked);
    // console.log('Check dislike');
    // console.log(checkUserDisliked);
    // Like lần đầu

    if (type === 1 && !checkUserDisliked) {
      await this.prisma.client.updateReviews({
        where: {
          reviewID: id,
        },
        data: {
          peopleLiked: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      const likeAndDislikePayloads = await this.prisma.client
        .reviews({
          reviewID: id,
        })
        .$fragment(fragment);
      return this.pubSub.publish('realtimeLikeDislike', likeAndDislikePayloads);
    }
    // Dislike lần đầu
    if (type === 2 && !checkUserLiked) {
      await this.prisma.client.updateReviews({
        where: {
          reviewID: id,
        },
        data: {
          peopleDisliked: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      const likeAndDislikePayloads = await this.prisma.client
        .reviews({
          reviewID: id,
        })
        .$fragment(fragment);
      return this.pubSub.publish('realtimeLikeDislike', likeAndDislikePayloads);
    }
    // Like và bỏ dislike
    if (type == 1 && checkUserDisliked) {
      await this.prisma.client.updateReviews({
        where: {
          reviewID: id,
        },
        data: {
          peopleLiked: {
            connect: {
              id: user.id,
            },
          },
          peopleDisliked: {
            disconnect: {
              id: user.id,
            },
          },
        },
      });
      const likeAndDislikePayloads = await this.prisma.client
        .reviews({
          reviewID: id,
        })
        .$fragment(fragment);
      return this.pubSub.publish('realtimeLikeDislike', likeAndDislikePayloads);
    }
    // Dislike và bỏ like
    if (type == 2 && checkUserLiked) {
      await this.prisma.client.updateReviews({
        where: {
          reviewID: id,
        },
        data: {
          peopleLiked: {
            disconnect: {
              id: user.id,
            },
          },
          peopleDisliked: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      const likeAndDislikePayloads = await this.prisma.client
        .reviews({
          reviewID: id,
        })
        .$fragment(fragment);
      return this.pubSub.publish('realtimeLikeDislike', likeAndDislikePayloads);
    }
  }
  @Mutation()
  async forgetPassword(@Args('email') email: string, @ResGql() res: Response) {
    console.log('Email input is ', email);
    const user = await this.prisma.client.user({ email });
    if (!user) {
      throw Error('Email not exists');
    }
    const code = uuidv4();
    res.cookie('reset-password', code, {
      httpOnly: false,
      sameSite: 'none',
      secure: true,
      domain: '.hotel-prisma.vercel.app',
    });
    return this.mailService.sendEmail(email, code);
  }
  @Mutation()
  async checkNotification(@Args('id') id) {
    await this.prisma.client.updateManyNotifications({
      where: {
        userNotificationId: id,
      },
      data: {
        old: true,
      },
    });
    return await this.prisma.client.updateUser({
      where: {
        id,
      },
      data: {
        unreadNotification: 0,
      },
    });
  }
  @Mutation()
  async readNotification(@Args('id') query) {
    return await this.prisma.client.updateManyNotifications({
      where: {
        query,
      },
      data: {
        read: true,
      },
    });
  }
  @Mutation()
  async deleteAllNotifications(@Args('id') id) {
    return await this.prisma.client.deleteManyNotifications({
      userNotificationId: id,
    });
  }
  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createCoupon(
    @GqlUser() user: User,
    @Args('coupon') coupon: CouponInput,
    @Args('type') type: number,
    @Args('hotelsId') hotelsId: any[],
  ) {
    console.log(type);
    // Tạo cho tất cả hotel
    if (type === 1) {
      const hotels = await this.prisma.client.hotels({
        where: {
          agentId: user.id,
        },
      });
      const coupons = await this.prisma.client.createCoupon({
        couponName: coupon.couponName,
        couponDescription: coupon.couponDescription,
        couponQuantity: coupon.couponQuantity,
        couponAuthor: {
          connect: {
            id: user.id,
          },
        },
        couponAuthorId: user.id,
        couponType: coupon.couponType,
        couponValue: coupon.couponValue,
        couponStartDate: coupon.couponStartDate,
        couponEndDate: coupon.couponEndDate,
      });
      return hotels.map(async i => {
        return await this.prisma.client.updateHotel({
          where: {
            id: i.id,
          },
          data: {
            couponsAvailable: {
              connect: {
                couponId: coupons.couponId,
              },
            },
          },
        });
      });
    }
    // Tạo cho hotels có id trong hotelId
    if (type == 2) {
      let isValid = true;
      await Promise.all(
        hotelsId.map(async i => {
          if (!isMongoId(i)) {
            isValid = false;
            throw Error(`'${i}' is not a valid MongoID`);
          }
          const hotelExists = await this.prisma.client
            .user({ id: user.id })
            .listed_posts({ where: { id: i } });
          if (hotelExists && hotelExists.length === 0) {
            isValid = false;
            throw Error(`'${i}' is not one of your Hotels`);
          }
        }),
      );
      if (isValid) {
        const coupons = await this.prisma.client.createCoupon({
          couponName: coupon.couponName,
          couponDescription: coupon.couponDescription,
          couponQuantity: coupon.couponQuantity,
          couponAuthor: {
            connect: {
              id: user.id,
            },
          },
          couponAuthorId: user.id,
          couponType: coupon.couponType,
          couponValue: coupon.couponValue,
          couponStartDate: coupon.couponStartDate,
          couponEndDate: coupon.couponEndDate,
        });

        return hotelsId.map(async i => {
          // console.log(i);
          // console.log(isValid);
          // if (!isValid)
          //   throw Error(`ID '${i}' is not exists in your current Hotels`);
          return await this.prisma.client.updateHotel({
            where: {
              id: i,
            },
            data: {
              couponsAvailable: {
                connect: {
                  couponId: coupons.couponId,
                },
              },
            },
          });
        });
      }
    }
  }
  @Mutation()
  @UseGuards(GqlAuthGuard)
  async makeReviews(
    @GqlUser() user: User,
    @Args('hotelId') id: ID_Input,
    @Args('reviews') review: ReviewInput,
  ) {
    // console.log(id);
    console.log(user.id + ' Id nguoi reviewed');
    const hotelManagerId = await this.prisma.client.hotel({ id }).agentId();
    const reviewedHotelName = await this.prisma.client.hotel({ id }).title();
    const slug = await this.prisma.client.hotel({ id }).slug();
    const updateRatingCount = await this.prisma.client
      .reviewsesConnection({
        where: {
          reviewedHotelId: id,
        },
      })
      .aggregate()
      .count();
    console.log(updateRatingCount);
    const query = `post/${slug}/${id}#reviews`;
    // const unreadNotification = await this.prisma.client
    //   .notificationsConnection({
    //     where: {
    //       userNotificationId: user.id,
    //       old: false,
    //     },
    //   })
    //   .aggregate()
    //   .count();
    // console.log(unreadNotification);
    const peopleReviewedArr = await this.prisma.client
      .hotel({ id })
      .peopleReviewed();
    // console.log(JSON.stringify(peopleReviewedArr) + 'First');
    const hotelMangerIndex =
      peopleReviewedArr.findIndex(id => hotelManagerId === id.id) === -1
        ? 1
        : 0;
    if (hotelMangerIndex === 1) {
      console.log('updated hotel manager');
      await this.prisma.client.updateHotel({
        where: {
          id,
        },
        data: {
          peopleReviewed: {
            connect: {
              id: hotelManagerId,
            },
          },
        },
      });
    }
    const index =
      peopleReviewedArr.findIndex(id => user.id === id.id) === -1 ? 1 : 0;
    console.log(index);
    if (index === 1) {
      console.log('updated');
      await this.prisma.client.updateHotel({
        where: {
          id,
        },
        data: {
          peopleReviewed: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }
    this.pubSub.publish('notificationBell', {
      notificationBell: {
        reviewAuthorName: user.first_name + ' ' + user.last_name,
        reviewedHotelName,
        reviewedAuthorId: user.id,
        reviewTitle: review.reviewTitle,
        reviewText: review.reviewText,
        reviewAuthorProfilePic: user.profile_pic_main,
        peopleReviewedQuantity: peopleReviewedArr.length,
        query,
        read: false,
        peopleReviewedArr,
      },
    });
    peopleReviewedArr && peopleReviewedArr.length > 0
      ? peopleReviewedArr.map(async i => {
          if (i.id !== user.id) {
            const unreadNotification = await this.prisma.client
              .notificationsConnection({
                where: {
                  userNotificationId: i.id,
                  old: false,
                },
              })
              .aggregate()
              .count();
            // console.log(i.id + unreadNotification);
            this.pubSub.publish('unreadNotification', {
              unreadNotification: {
                reviewedAuthorId: i.id,
                unreadNotification: unreadNotification + 1,
              },
            });
            console.log(unreadNotification, i.id);
            await this.prisma.client.updateUser({
              where: {
                id: i.id,
              },
              data: {
                notification: {
                  create: {
                    reviewAuthorName: user.first_name + ' ' + user.last_name,
                    reviewedHotelName,
                    reviewTitle: review.reviewTitle,
                    reviewText: review.reviewText,
                    userNotificationId: i.id,
                    query,
                    reviewAuthorProfilePic: user.profile_pic_main,
                    peopleReviewedQuantity: peopleReviewedArr.length,
                  },
                },
                unreadNotification: unreadNotification + 1,
              },
            });
          }
        })
      : '';
    await this.prisma.client.updateHotel({
      where: { id },
      data: {
        ratingCount: updateRatingCount + 1,
      },
    });
    // console.log(JSON.stringify(peopleReviewedArr) + 'Second');
    const reviewSub = await this.prisma.client.createReviews({
      reviewOverall: review.reviewOverall,
      reviewTitle: review.reviewTitle,
      reviewText: review.reviewText,
      sortOfTrip: review.sortOfTrip,
      reviewTips: review.reviewTips,
      reviewAuthorId: {
        connect: {
          id: user.id,
        },
      },
      reviewAuthorEmail: user.email,
      reviewAuthorFirstName: user.first_name,
      reviewAuthorLastName: user.last_name,
      reviewAuthorPic: user.profile_pic_main,
      reviewFields: {
        create: review.reviewFieldInput,
      },
      reviewPics: {
        create: review.reviewPics,
      },
      reviewedHotel: {
        connect: {
          id: id,
        },
      },
      reviewedHotelId: id,
      reviewOptional: {
        create: review.reviewOptionals,
      },
    });
    // console.log(reviewToSubscribe);
    const fragment = `fragment someFrag on Reviews {
      reviewID
    reviewTitle
    reviewText
    sortOfTrip
    reviewAuthorId {
      id
    }
    reviewAuthorFirstName
    reviewAuthorLastName
    reviewAuthorEmail
    reviewOverall
    reviewAuthorPic
    reviewedHotelId
    reviewTips
    reviewPics {
      url
    }
    reviewDate
    reviewOptional {
      option
      optionField
    }
    reviewFields {
      rating
      ratingFieldName
    }
    }`;
    const reviewToSubscribe = await this.prisma.client
      .reviews({
        reviewID: reviewSub.reviewID,
      })
      .$fragment(fragment);
    this.pubSub.publish('realtimeReviews', reviewToSubscribe);
    // console.log(reviewToSubscribe);
    return reviewSub;
  }
  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updateStripeId(
    @GqlUser() user: User,
    @Args('stripeId') stripeId,
    @Args('type') type,
  ) {
    if (user.role === 'Normal') {
      return await this.prisma.client.updateUser({
        where: {
          id: user.id,
        },
        data: {
          stripeId,
          role: type || 'Normal',
        },
      });
    }
    return await this.prisma.client.updateUser({
      where: {
        id: user.id,
      },
      data: {
        role: type,
      },
    });
  }
  @Subscription(returns => Unread, {
    // So data và biến filter channel
    // filter(payloads, variables) {
    //   console.log('Nguoi comment' + payloads.notification.reviewAuthorId);
    //   // return variables.channelId[1].userId === '5f2b5c8aa7b11b00078d09b1';
    //  return _.forEach( variables.channelId, function(i){
    //     return i.userId !==payloads.notification.reviewAuthorId
    //   })
    //   // return variables.channelId.forEach(i => {
    //   //   console.log(i.userId)
    //   //   return i.userId === '5f2b5c8aa7b11b00078d09b1';
    //   // });
    // console.log(_.find(payloads.notification.peopleReviewedArr, {
    //   id: variables.channelId,
    // }))
    // console.log(_.find(payloads.notification.peopleReviewedArr, {
    //   id: variables.channelId,
    // }) !== undefined)
    //  console.log( _.find(payloads.notification.peopleReviewedArr, {
    //     id: variables.channelId,
    //   }) !== 'undefined' &&
    //   variables.channelId !== payloads.notification.reviewAuthorId)
    //   return true;
    // },
    filter: (payloads, variables) =>
      // Special
      // _.find(payloads.unreadNotification.peopleReviewedArr, {
      //   id: variables.channelId,
      // }) !== undefined &&
      // variables.channelId !== payloads.unreadNotification.reviewedAuthorId,
      payloads.unreadNotification.reviewedAuthorId === variables.channelId,
    // payloads.notification.peopleReviewedArr.map(id => {
    //   console.log(payloads.notification.peopleReviewedArr)
    //   console.log(variables.channelId + 'Id lang nghe');
    //   console.log(payloads.notification.reviewAuthorId + ' id nguoi comment');
    //   console.log(
    //     id.id === variables.channelId &&
    //       id.id !== payloads.notification.reviewAuthorId + ' True false',
    //   );
    //   console.log(id.id);
    //  const test = _.find(payloads.notification.peopleReviewedArr, {id:variables.channelId});
    //  console.log(test);
    //    (id.id === variables.channelId &&
    //     id.id !== payloads.notification.reviewAuthorId);
    // }),
  })
  // Hứng
  unreadNotification() {
    return this.pubSub.asyncIterator('unreadNotification');
  }

  @Subscription(returns => Notification, {
    // resolve(this: PrismaService, payloads, variables, anotherSub: PubSubEngine) {
    //   console.log(payloads)
    //   console.log(variables.channelId)
    // },
    // filter(payloads, variables) {
    //   // console.log(payloads);
    //   // console.log(variables);
    //   console.log(
    //     _.find(payloads.notificationBell.peopleReviewedArr, {
    //       id: variables.channelId,
    //     }) !== undefined &&
    //       variables.channelId !== payloads.notificationBell.reviewAuthorId,
    //   );
    //   return (
    //     _.find(payloads.notificationBell.peopleReviewedArr, {
    //       id: variables.channelId,
    //     }) !== undefined &&
    //     variables.channelId !== payloads.notificationBell.reviewAuthorId
    //   );
    // },
    filter: (payloads, variables) =>
      _.find(payloads.notificationBell.peopleReviewedArr, {
        id: variables.channelId,
      }) !== undefined &&
      variables.channelId !== payloads.notificationBell.reviewedAuthorId,
  })
  notificationBell() {
    return this.pubSub.asyncIterator('notificationBell');
  }

  @Subscription(returns => Reviews, {
    resolve(this: PrismaService, payloads, variables) {
      return payloads;
    },
    filter: (payloads, variables) =>
      payloads.reviewedHotelId === variables.hotelId,
  })
  realtimeReviews() {
    return this.pubSub.asyncIterator('realtimeReviews');
  }
  @Subscription(returns => Reviews, {
    resolve: payloads => payloads,
    filter: (payloads, variables) => payloads.reviewID === variables.reviewID,
  })
  realtimeLikeDislike() {
    return this.pubSub.asyncIterator('realtimeLikeDislike');
  }
}
