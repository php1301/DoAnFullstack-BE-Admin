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
}
