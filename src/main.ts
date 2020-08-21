import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookierParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookierParser());
  app.enableCors({
    credentials: true,
    origin: true,
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
