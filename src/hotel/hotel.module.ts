import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelResolver } from './hotel.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [HotelService, HotelResolver],
  imports: [PrismaModule],
})
export class HotelModule {}
