import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as mailjet from 'node-mailjet';
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  public sendEmail(email, code): void {
    // console.log(email, process.env.LOCAL_EMAIL, process.env.LOCAL_PASSWORD);
    this.mailerService
      .sendMail({
        to: email,
        from: process.env.LOCAL_EMAIL,
        subject: 'Reset password Link ✔',
        template: process.cwd() + '/template/reset',
        context: {
          email,
          code,
        },
      })
      .then(success => {
        console.log(success + email);
      })
      .catch(err => {
        console.log(err);
      });
  }
  public sendContact(subject, email, messsage, cellNumber): void {
    this.mailerService
      .sendMail({
        from: email,
        to: process.env.LOCAL_EMAIL,
        subject,
        html: `<div>
        <h1>${subject}</h1>
        <h3>From: ${email}</h3>
        <p>Message: ${messsage}</p>
        <h2>Phone: ${cellNumber}</h2>
        </div>`,
      })
      .then(success => {
        console.log(success + email);
      })
      .catch(err => {
        console.log(err);
      });
  }
  public mockMailjet(data): void {
    console.log(data.authorEmail);
    const request = mailjet
      .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.LOCAL_MJ_EMAIL,
              Name: 'Palace TripFinder',
            },
            To: [
              {
                Email: data.authorEmail,
                Name: data.authorName,
              },
            ],
            TemplateID: 1645231,
            TemplateLanguage: true,
            Subject: `Receipt about ${data.hotelName} Room: ${data.room} Guest: ${data.guest} of ${data.authorName}`,
            Variables: {
              firstname: data.authorName,
              startDate: data.startDate,
              endDate: data.endDate,
              hotelName: data.hotelName,
              guest: data.guest,
              room: data.room,
              couponName: data.couponName,
              total_price: data.total_price,
              order_date: data.order_date,
              order_id: data.order_id,
            },
          },
        ],
      });
    request
      .then(result => {
        console.log(result.body);
      })
      .catch(err => {
        console.log(err.statusCode);
      });
  }
}
