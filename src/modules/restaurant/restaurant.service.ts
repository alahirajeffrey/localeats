import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponse, geohashCoordinates } from 'src/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from './restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(private readonly prisma: PrismaService) {}

  // async findRestaurants(dto: FindRestaurantDto): Promise<ApiResponse> {
  //   const {
  //     latitude,
  //     longitude,
  //     cuisine,
  //     priceRange,
  //     openNow,
  //     radiusKm = 5,
  //   } = dto;

  //   // convert raduis from kilometers to meters
  //   const radiusMeters = radiusKm * 1000;
  // }

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
        ...dto,
        geohash,
        cuisine: { create: { name: dto.cuisine, price: dto.price } },
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
