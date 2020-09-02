import { Injectable, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import Stripe from 'stripe';
// import { stripe } from './data';
@Injectable()
export class StripeService {
  // Stripe ko cung cấp injectable service
  // Có thể tạo DTO
  // Session flow url cho mỗi stripe
  // Sử dụng validation pipe
  // construct events với webhook

  private readonly stripe: Stripe = new Stripe(process.env.STRIPE_SECRET, {
    apiVersion: '2020-08-27',
  });

  public async createStripeAccount(
    plan,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<void> {
    const data = req.body;
    try {
      const account = await this.stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: plan.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },

        business_type: 'individual', // trong test mode + Chặn payment bằng cách đổi qua country qua NZ
        individual: {                // Allow all bằng cách tạo account có các field thủ công hoặc tạo xong và bỏ field SSN 
          id_number: '000000000',
          ssn_last_4: '0000',
        },
        //   external_account: data.external_account,
        //   tos_acceptance:{
        //     date: Math.round((new Date()).getTime()/1000),
        //     ip: req.ip,

        //   },
        //   business_profile: {
        //     url: data.url,
        //     mcc: '7623',
        //   },
        //   company: {
        //     name: data.name,
        //     phone: data.phone,
        //     tax_id: data.tax_id,
        //     address: {
        //       line1: data.line1,
        //       line2: data.line2,
        //       state: data.state,
        //       postal_code: data.postal_code,
        //     },
        //   },
      });
      const accountLink = await this.stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'https://vercel-v2.hotel-prisma.ml//error', // Khi link ko còn valid
        return_url: `https://vercel-v2.hotel-prisma.ml/processing?accountId=${account.id}&plan=${plan.type}`, // redirect  //Dev mode thì đang http
        type: 'account_onboarding',
      });
      res.status(200).json({ accountLink });
    } catch (e) {
      res.status(400).json({ code: 'error', message: e.message });
    }
  }
  public async accessStripeDashboardConnected(account, @Res() res: Response) {
    try {
      const link = await this.stripe.accounts.createLoginLink(account.id);
      res.status(200).json({ link });
    } catch (e) {
      throw Error(e.message);
    }
  }
  public async handleClientCard(data, @Res() res: Response): Promise<void> {
    console.log(data);
    try {
      const paymentIntents = await this.stripe.paymentIntents.create(
        {
          amount: data.amount,
          currency: 'usd',
        },
        {
          stripeAccount: data.stripeId || '',
        },
      );
      res.status(200).json({ client_secret: paymentIntents.client_secret });
    } catch (e) {
      res.status(500).json({ statusCode: 500, message: e.message });
    }
  }
}
