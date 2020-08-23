import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  Res,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AwsService } from 'src/aws/aws.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';

import { StripeService } from './stripe';

@Controller('api')
export class UploadController {
  constructor(private aws: AwsService, private stripeApi: StripeService) {}
  @Post('uploadFile')
  @UseInterceptors(FilesInterceptor('files[]'))
  async uploadFile(@UploadedFiles() files) {
    // console.log(files)
    return await this.aws.uploadFile(files);
  }
  @Post('mock-payment')
  async mockPayment(@Body() data, @Res() res: Response) {
    // console.log(amount.amount);
    this.stripeApi.handleClientCard(data, res);
  }
  @Post('mock-stripe')
  async mockStripe(@Body() plan, @Res() res: Response, @Req() req: Request) {
    this.stripeApi.createStripeAccount(plan, res, req);
  }
  @Post('access-mock-stripe')
  async accessMockStripe(@Body() account, @Res() res: Response) {
    this.stripeApi.accessStripeDashboardConnected(account, res);
  }
  @Post('mock')
  async mock(@Body() receivedMockData: string[]) {
    console.log(receivedMockData);
    fs.writeFile('mock.ts', JSON.stringify(receivedMockData, null, 4), err => {
      if (err) throw err;
    });
    console.log('MockData exported');
    // Có thể viết class lấy hàm như aws làm hoặc execute prisma seed
  }
  // @Post('mock-mail-jet')
  // async mockMailjet(@Body() content) {
  //   const request = mailjet.post('send', { version: 'v3.1' }).request({
  //     Messages: [
  //       {
  //         From: {
  //           Email: '19520854@gm.uit.edu.vn',
  //           Name: 'Palace TripFinder',
  //         },
  //         To: [
  //           {
  //             Email: 'passenger1@example.com',
  //             Name: 'passenger 1',
  //           },
  //         ],
  //         TemplateID: 1645231,
  //         TemplateLanguage: true,
  //         Subject: 'Palace',
  //         Variables: {
  //           firstname: 'Default value',
  //           startDate: '10-01-2001',
  //           endDate: '20-01-2001',
  //           hotelName: '',
  //           guest: '1',
  //           room: '1',
  //           couponName: 'name',
  //           total_price: 'Default value',
  //           order_date: 'Default value',
  //           order_id: 'Default value',
  //         },
  //       },
  //     ],
  //   });
  //   request
  //     .then(result => {
  //       console.log(result.body);
  //     })
  //     .catch(err => {
  //       console.log(err.statusCode);
  //     });
  // }
}
