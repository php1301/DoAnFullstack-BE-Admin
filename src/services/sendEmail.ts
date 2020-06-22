import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  public sendEmail(email): void {
    console.log(email, process.env.LOCAL_EMAIL, process.env.LOCAL_PASSWORD);
    this.mailerService
      .sendMail({
        to: email,
        from: process.env.LOCAL_EMAIL,
        subject: 'Reset password Link ✔',
        template: __dirname + '/template/reset',
        context: {
          email: email,
        },
      })
      .then(success => {
        console.log(success + email);
      })
      .catch(err => {
        console.log(err);
      });
  }
  public sendContact(email, messsage, cellNumber, targetEmail): void {
    this.mailerService
      .sendMail({
        to: targetEmail,
        from: process.env.LOCAL_EMAIL,
        subject: 'Reset password Link ✔',
        html: `<div>
        <h3>${email}</h3>
        <p>${messsage}</p>
        <h2>${cellNumber}</h2>
        </div>`,
      })
      .then(success => {
        console.log(success + targetEmail);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
