import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponse, geohashCoordinates, isProximityMatch } from 'src/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateRestaurantDto,
  FindRestaurantDto,
  UpdateRestaurantDto,
} from './restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(private readonly prisma: PrismaService) {}

  async findRestaurants(dto: FindRestaurantDto) {
    const {
      latitude,
      longitude,
      cuisine,
      minimumPrice,
      maximumPrice,
      openNow,
      radiusKm = 5,
      page = 1,
      limit = 20,
    } = dto;

    const radiusMeters = (radiusKm || 5) * 1000;

    const where: any = {};
    if (cuisine) where.cuisine = cuisine;
    if (minimumPrice !== undefined || maximumPrice !== undefined) {
      where.price = {};
      if (minimumPrice !== undefined) where.price.gte = minimumPrice;
      if (maximumPrice !== undefined) where.price.lte = maximumPrice;
    }
    if (openNow) where.isOpen = true;

    // fetch restaurants with pagination
    const restaurants = await this.prisma.restaurant.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });

    if (!latitude || !longitude)
      return { data: restaurants, message: 'Restaurants fetched successfully' };

    // filter by distance
    const nearbyRestaurants = restaurants.filter((restaurant) =>
      isProximityMatch(longitude, latitude, restaurant.geohash, radiusMeters),
    );

    return {
      data: nearbyRestaurants,
      message: 'Restaurants fetched successfully',
    };
  }

  async fetchRestaurantById(restaurantId: string): Promise<ApiResponse> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant not found`);
    }

    return { data: restaurant, message: 'Restaurant fetched succesfully' };
  }

  async addRestaurant(dto: CreateRestaurantDto): Promise<ApiResponse> {
    const geohash = geohashCoordinates(dto.longitude, dto.latitude);

    const restaurant = await this.prisma.restaurant.create({
      data: {
        name: dto.name,
        latitude: dto.latitude,
        longitude: dto.longitude,
        open: dto.open,
        geohash,
        cuisine: {
          create: { name: dto.cuisine.toLowerCase(), price: dto.price },
        },
      },
    });

    return { message: 'Restaurant created successfully', data: restaurant };
  }

  async deleteRestaurant(restaurantId: string): Promise<ApiResponse> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant not found`);
    }

    await this.prisma.restaurant.delete({
      where: { id: restaurantId },
    });

    return { message: 'Restaurant deleted successfully' };
  }

  async updateRestaurantDetails(
    restaurantId: string,
    dto: UpdateRestaurantDto,
  ): Promise<ApiResponse> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant not found`);
    }

    const restaurantUpdates: any = { ...dto };

    if (dto.latitude && dto.longitude) {
      restaurantUpdates.geohash = geohashCoordinates(
        dto.longitude,
        dto.latitude,
      );
    }

    await this.prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        ...restaurantUpdates,
      },
    });

    return { message: 'Restaurant updated successfully' };
  }
}
