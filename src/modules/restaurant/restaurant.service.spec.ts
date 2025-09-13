import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from './restaurant.service';
import { PrismaService } from '../prisma/prisma.service';
import * as geohash from 'ngeohash';

describe('RestaurantService - Distance Filtering', () => {
  let service: RestaurantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        {
          provide: PrismaService,
          useValue: {
            restaurant: {
              findMany: jest.fn().mockResolvedValue([
                {
                  id: 1,
                  name: 'Pizza Place',
                  geohash: geohash.encode(40.748817, -73.985428),
                  cuisine: { name: 'italian', price: 20 },
                  open: true,
                },
                {
                  id: 2,
                  name: 'Rice Joint',
                  geohash: geohash.encode(40.73061, -73.935242),
                  cuisine: { name: 'nigerian', price: 15 },
                  open: true,
                },
              ]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
  });

  it('should return only restaurants within the given radius: 1 restaurant', async () => {
    // < 1 km
    const result = await service.findRestaurants({
      latitude: 40.748817,
      longitude: -73.985428,
      radiusKm: 1,
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('Pizza Place');
  });

  it('should return restaurants within 5km radius: 2 restaurants', async () => {
    // < 5 km
    const result = await service.findRestaurants({
      latitude: 40.748817,
      longitude: -73.985428,
      radiusKm: 5,
    });

    expect(result.data).toHaveLength(2);
  });
});
