import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponse, geohashCoordinates, isProximityMatch } from 'src/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
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

    const radiusMeters = radiusKm * 1000;

    // build filter query
    const where: any = {};

    if (cuisine || minimumPrice !== undefined || maximumPrice !== undefined) {
      where.cuisine = {};
      if (cuisine) where.cuisine.name = cuisine.toLowerCase();
      if (minimumPrice !== undefined || maximumPrice !== undefined) {
        where.cuisine.price = {};
        if (minimumPrice !== undefined) where.cuisine.price.gte = minimumPrice;
        if (maximumPrice !== undefined) where.cuisine.price.lte = maximumPrice;
      }
    }

    if (openNow !== undefined) where.open = openNow;

    // fetch retaurants with pagination
    const restaurants = await this.prisma.restaurant.findMany({
      where,
      include: { cuisine: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Iif no location filtering, return all fetched restaurants
    if (latitude === undefined || longitude === undefined) {
      return {
        data: restaurants,
        message: 'Restaurants fetched successfully',
      };
    }

    // filter by distance using your geolocation utility
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
          create: { name: dto.cuisine, price: dto.price },
        },
      },
      include: {
        cuisine: true,
      },
    });

    return {
      message: 'Restaurant created successfully',
      data: restaurant,
    };
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
