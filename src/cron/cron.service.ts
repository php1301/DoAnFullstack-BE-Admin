import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/services/sendEmail';
@Injectable()
export class CronService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}
  //   private readonly mailService: MailService;
  private readonly logger = new Logger(CronService.name);

  @Cron(CronExpression.EVERY_DAY_AT_9PM, {
    name: 'notiCron',
  })
  async handleCron() {
    //  Có thể ứng dụng làm chức năng subscribe blog, newsletter
    //  Demo mẫu gửi email
    //  Thường cronn email nên service bên thứ 3
    //  Tham khảo easycron.com
    //  Timeout delay lại time
    //  Interval executes callback đúng sau x asterisk
    //  Có thể dùng gọi sự kiện delete prisma hay process trong project này là coupon hết hạn,...
    //  Ở đây mock nhanh bằng cách gửi về process.env.LOCAL_EMAIL (admin)
    const pendingTransactions = await this.prisma.client
      .transactionsConnection({
        where: {
          transactionHotelManagerId: '5f2b768aa7b11b00078d09d8',
          transactionStatus: 'PENDING',
        },
      })
      .aggregate()
      .count();
    const message = `You are having ${pendingTransactions} pending transactions`;
    this.logger.debug(message);
    return this.mailService.sendContact(
      'CRON ABOUT NUMBER OF PENDING TRANSACTIONS',
      'minha1403@gmail.com',
      message,
      '00000x00000',
    );
  }
}
