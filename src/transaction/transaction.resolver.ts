import { Resolver, Mutation, Args, Query, Subscription } from '@nestjs/graphql';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UseGuards, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/services/sendEmail';
import {
  TransactionInput,
  User,
  CouponCheckedPayload,
  TransactionNotification,
} from 'src/graphql.schema.generated';
import { GqlUser } from 'src/shared/decorators/decorator';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { PubSubEngine } from 'graphql-subscriptions';

@Resolver('Transaction')
export class TransactionResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  expire = coupon => {
    const date = new Date();
    const endDate = new Date(coupon);
    return date > endDate;
  };
  @Query()
  @UseGuards(GqlAuthGuard)
  async getTransactionsHaving(@GqlUser() user: User) {
    const fragment = `fragment transactionFragment on User{
      TXID
      transactionSecretKey
      transactionHotelName
      transactionHotelId
      transactionHotelManager{
          first_name
          last_name
          email
          cellNumber
      }
      transactionHotelManagerId
      transactionHotelType
      transactionPrice
      transactionAuthorId
      transactionAuthorName
      transactionAuthorEmail
      transactionAuthorContactNumber
      transactionAuthorSpecial
      transactionAuthorNote
      transactionLocationLat
      transactionLocationLng
      transactionLocationFormattedAddress
      transactionRoom
      transactionGuest
      transactionRange
      transactionStatus
      transactionCoupon
      transactionCouponType
      transactionCouponValue
      transactionStripeId
      transactionStartDate
      transactionEndDate
    }`;
    const job = this.schedulerRegistry.getCronJob('notiCron');
    job.stop();
    console.log(job.lastDate());
    return this.prisma.client
      .user({ id: user.id })
      .transaction_had({
        orderBy: 'createdAt_DESC',
      })
      .$fragment(fragment);
  }
  @Query()
  async getTransactionDetails(
    @Args('transactionSecretKey') transactionSecretKey,
  ) {
    const fragment = `fragment getTransactionDetailsFragment on Transaction{
      transactionHotelManager{
        first_name
        last_name
        email
        cellNumber
    }
    transactionAuthorName
    transactionHotelName
    transactionLocationLat
    transactionHotelType
    transactionPrice
    transactionLocationLng
    transactionLocationFormattedAddress
    transactionRoom
    transactionGuest
    transactionRange
    transactionStatus
    transactionCoupon
    transactionCouponType
    transactionCouponValue
    transactionStartDate
    transactionEndDate
    }`;
    return this.prisma.client
      .transactions({
        where: {
          transactionSecretKey,
        },
      })
      .$fragment(fragment);
  }
  @Query()
  @UseGuards(GqlAuthGuard)
  async getTotalUnreadTransactions(@GqlUser() user: User) {
    const fragment = `fragment totalUnreadTransactions on User {
      uncheckTransactions{
        userUncheckTransactionsId
        totalPrice
        totalTransactions
      }
    }`;
    return await this.prisma.client.user({ id: user.id }).$fragment(fragment);
  }
  @Mutation()
  async checkCoupon(@Args('hotelId') hotelId, @Args('couponName') couponName) {
    // Strict thêm chỉ áp dụng cho hotel này
    // Field nào unique là đều kiếm được
    const fragment = `fragment checkCoupon on Coupon{
      couponQuantity
      couponName
      couponId
      couponType
      couponValue
    }`;
    const couponPayload = await this.prisma.client
      .hotel({ id: hotelId })
      .couponsAvailable({
        where: {
          couponName,
        },
      })
      .$fragment(fragment);
    console.log(couponPayload);

    // Coupon hết số lượng
    if (couponPayload && couponPayload[0].couponQuantity === 0) {
      throw Error('Coupon is running out of uses');
    }
    // Coupon hết hạn
    if (couponPayload && this.expire(couponPayload[0].couponEndDate)) {
      throw Error('Coupon is expired');
    }
    if (couponPayload && couponPayload[0].couponType) {
      await this.prisma.client.updateCoupon({
        where: {
          couponId: couponPayload[0].couponId,
        },
        data: {
          couponQuantity: couponPayload[0].couponQuantity - 1,
        },
      });
      return couponPayload[0];
    }
    throw Error('Coupon is invalid for this Hotel');
  }
  @Mutation()
  async createTransaction(
    @Args('transaction') transaction: TransactionInput,
    @Args('hotelId') hotelId: string,
    @Args('coupon') coupon: CouponCheckedPayload,
    @Args('userId') userId,
  ) {
    console.log(userId);
    // Không nhập coupon

    if (!coupon) {
      console.log('no coupon');
      const transactionPayload = await this.prisma.client.createTransaction({
        transactionSecretKey: uuidv4(),
        transactionHotelId: hotelId,
        transactionHotelName: transaction.transactionHotelName,
        transactionHotelManagerId: transaction.transactionHotelManagerId,
        transactionHotelManager: {
          connect: {
            id: transaction.transactionHotelManagerId,
          },
        },
        transactionHotelType: transaction.transactionHotelType,
        transactionPrice: transaction.transactionPrice,
        transactionAuthor: userId && {
          connect: {
            id: userId,
          },
        },
        transactionAuthorId: userId || 'non-member',
        transactionAuthorName: transaction.transactionAuthorName,
        transactionAuthorEmail: transaction.transactionAuthorEmail,
        transactionAuthorContactNumber:
          transaction.transactionAuthorContactNumber,
        transactionAuthorSpecial: transaction.transactionAuthorSpecial,
        transactionAuthorNote: transaction.transactionAuthorNote,
        transactionStartDate: transaction.transactionStartDate,
        transactionEndDate: transaction.transactionEndDate,
        transactionRange: transaction.transactionRange,
        transactionLocationLat: transaction.transactionLocationLat,
        transactionLocationLng: transaction.transactionLocationLng,
        transactionLocationFormattedAddress:
          transaction.transactionLocationFormattedAddress,
        transactionRoom: transaction.transactionRoom,
        transactionGuest: transaction.transactionGuest,
        transactionStatus: 'PENDING',
        transactionStripeId: transaction.transactionStripeId,
        transactionCoupon: 'None',
        transactionCouponType: 3, // Không xài coupon
        transactionCouponValue: 0,
      });
      const date = new Date();
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      const dataMail = {
        authorEmail: transaction.transactionAuthorEmail,
        authorName: transaction.transactionAuthorName,
        firstName: transaction.transactionAuthorName,
        startDate: transaction.transactionStartDate,
        endDate: transaction.transactionEndDate,
        hotelName: transaction.transactionHotelName,
        couponName: 'No Coupon',
        room: transactionPayload.transactionRoom,
        guest: transactionPayload.transactionGuest,
        total_price: transactionPayload.transactionPrice,
        order_date:
          date.getFullYear() +
          '-' +
          (date.getMonth() + 1) +
          '-' +
          date.getDate(),
        order_id: transactionPayload.transactionSecretKey,
      };
      this.mailService.mockMailjet(dataMail);
      const transactionNotiPayload = {
        TXID: transactionPayload.TXID,
        transactionPrice: transaction.transactionPrice,
        transactionHotelManagerId: transaction.transactionHotelManagerId,
      };
      // Đáng lẽ nên refactor lại 1 loại form noti, truyền type là review, like, transaction
      this.pubSub.publish('realtimeNotiTransaction', transactionNotiPayload);
      const totalTransactions =
        (await this.prisma.client
          .user({
            id: transaction.transactionHotelManagerId,
          })
          .uncheckTransactions()
          .totalTransactions()) || 0;
      const totalPrice =
        (await this.prisma.client
          .user({
            id: transaction.transactionHotelManagerId,
          })
          .uncheckTransactions()
          .totalPrice()) || 0;
      console.log(totalTransactions);
      console.log(totalPrice);
      // upsert để tối ưu database storage
      await this.prisma.client.updateUser({
        where: {
          id: transaction.transactionHotelManagerId,
        },
        data: {
          uncheckTransactions: {
            upsert: {
              update: {
                totalTransactions: totalTransactions + 1,
                totalPrice: totalPrice + transaction.transactionPrice,
              },
              create: {
                userUncheckTransactionsId:
                  transaction.transactionHotelManagerId,
                totalTransactions: totalTransactions + 1,
                totalPrice: totalPrice + transaction.transactionPrice,
              },
            },
          },
        },
      });
      return transactionPayload;
    }

    // Có coupon và nhập coupon hợp lệ
    if (coupon) {
      console.log('coupon');
      // Nếu muốn update riêng từng Hotel vs 1 coupon thì create bên Hotel
      const transactionPayload = await this.prisma.client.createTransaction({
        transactionSecretKey: uuidv4(),
        transactionHotelId: hotelId,
        transactionHotelName: transaction.transactionHotelName,
        transactionHotelManagerId: transaction.transactionHotelManagerId,
        transactionHotelManager: {
          connect: {
            id: transaction.transactionHotelManagerId,
          },
        },
        transactionHotelType: transaction.transactionHotelType,
        transactionPrice: transaction.transactionPrice,
        transactionAuthor: userId && {
          connect: {
            id: userId,
          },
        },
        transactionAuthorId: userId || 'non-member',
        transactionAuthorName: transaction.transactionAuthorName,
        transactionAuthorEmail: transaction.transactionAuthorEmail,
        transactionAuthorContactNumber:
          transaction.transactionAuthorContactNumber,
        transactionAuthorSpecial: transaction.transactionAuthorSpecial,
        transactionAuthorNote: transaction.transactionAuthorNote,
        transactionStartDate: transaction.transactionStartDate,
        transactionEndDate: transaction.transactionEndDate,
        transactionRange: transaction.transactionRange,
        transactionLocationLat: transaction.transactionLocationLat,
        transactionLocationLng: transaction.transactionLocationLng,
        transactionLocationFormattedAddress:
          transaction.transactionLocationFormattedAddress,
        transactionRoom: transaction.transactionRoom,
        transactionGuest: transaction.transactionGuest,
        transactionStatus: 'PENDING',
        transactionStripeId: transaction.transactionStripeId,
        transactionCoupon: coupon.couponName,
        transactionCouponType: coupon.couponType,
        transactionCouponValue: coupon.couponValue,
      });
      const date = new Date();
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      const dataMail = {
        authorEmail: transaction.transactionAuthorEmail,
        authorName: transaction.transactionAuthorName,
        firstName: transaction.transactionAuthorName,
        startDate: transaction.transactionStartDate,
        endDate: transaction.transactionEndDate,
        hotelName: transaction.transactionHotelName,
        couponName: coupon.couponName,
        room: transactionPayload.transactionRoom,
        guest: transactionPayload.transactionGuest,
        total_price: transactionPayload.transactionPrice,
        order_date:
          date.getFullYear() +
          '-' +
          (date.getMonth() + 1) +
          '-' +
          date.getDate(),
        order_id: transactionPayload.transactionSecretKey,
      };
      this.mailService.mockMailjet(dataMail);
      const transactionNotiPayload = {
        TXID: transactionPayload.TXID,
        transactionPrice: transaction.transactionPrice,
        transactionHotelManagerId: transaction.transactionHotelManagerId,
      };
      // Đáng lẽ nên refactor lại 1 loại form noti, truyền type là review, like, transaction
      this.pubSub.publish('realtimeNotiTransaction', transactionNotiPayload);
      const totalTransactions =
        (await this.prisma.client
          .user({
            id: transaction.transactionHotelManagerId,
          })
          .uncheckTransactions()
          .totalTransactions()) || 0;
      const totalPrice =
        (await this.prisma.client
          .user({
            id: transaction.transactionHotelManagerId,
          })
          .uncheckTransactions()
          .totalPrice()) || 0;
      console.log(totalTransactions);
      console.log(totalPrice);
      // upsert để tối ưu database storage
      await this.prisma.client.updateUser({
        where: {
          id: transaction.transactionHotelManagerId,
        },
        data: {
          uncheckTransactions: {
            upsert: {
              update: {
                totalTransactions: totalTransactions + 1,
                totalPrice: totalPrice + transaction.transactionPrice,
              },
              create: {
                userUncheckTransactionsId:
                  transaction.transactionHotelManagerId,
                totalTransactions: totalTransactions + 1,
                totalPrice: totalPrice + transaction.transactionPrice,
              },
            },
          },
        },
      });
      return transactionPayload;
    }
  }
  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updateTotalUnreadTransactions(@GqlUser() user: User) {
    return this.prisma.client.updateUser({
      where: {
        id: user.id,
      },
      data: {
        uncheckTransactions: {
          update: {
            totalPrice: 0,
            totalTransactions: 0,
          },
        },
      },
    });
  }
  @UseGuards(GqlAuthGuard)
  @Mutation()
  async processTransactions(
    @GqlUser() user: User,
    @Args('id') id,
    @Args('type') type,
  ) {
    console.log(id);
    // Sử dụng cho demo - set tất cả pending
    if (type === 3) {
      return await this.prisma.client.updateManyTransactions({
        where: {
          transactionHotelManagerId: user.id,
        },
        data: {
          transactionStatus: 'PENDING',
        },
      });
    }
    return await this.prisma.client.updateManyTransactions({
      where: {
        transactionHotelManagerId: user.id,
        TXID_in: id,
      },
      data: {
        transactionStatus: type === 1 ? 'DONE' : 'CANCELLED',
      },
    });
  }
  @UseGuards(GqlAuthGuard)
  @Mutation()
  async deleteCoupons(@GqlUser() user: User, @Args('id') id) {
    // Ko show id của coupon ra -> gurantee ko xóa bậy bạ
    // Delete many không có in
    console.log(id);
    return id.map(i => {
      return this.prisma.client.deleteCoupon({
        couponId: i,
      });
    });
  }
  @Subscription(returns => TransactionNotification, {
    resolve: payloads => payloads,
    filter: (payloads, variables) =>
      payloads.transactionHotelManagerId === variables.userId,
  })
  realtimeNotificationTransaction() {
    return this.pubSub.asyncIterator('realtimeNotiTransaction');
  }
}
