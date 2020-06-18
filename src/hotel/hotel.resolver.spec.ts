import { Test, TestingModule } from '@nestjs/testing';
import { HotelResolver } from './hotel.resolver';

describe('HotelResolver', () => {
  let resolver: HotelResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HotelResolver],
    }).compile();

    resolver = module.get<HotelResolver>(HotelResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
