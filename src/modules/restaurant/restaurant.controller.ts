import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import {
  CreateRestaurantDto,
  FindRestaurantDto,
  UpdateRestaurantDto,
} from './restaurant.dto';
import { ApiResponse } from 'src/common';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get(':restaurantId')
  async getRestaurantById(
    @Param('restaurantId') restaurantId: string,
  ): Promise<ApiResponse> {
    return this.restaurantService.fetchRestaurantById(restaurantId);
  }

  @Post()
  async createRestaurant(
    @Body() dto: CreateRestaurantDto,
  ): Promise<ApiResponse> {
    return this.restaurantService.addRestaurant(dto);
  }

  @Delete(':restaurantId')
  async removeRestaurant(
    @Param('restaurantId') restaurantId: string,
  ): Promise<ApiResponse> {
    return this.restaurantService.deleteRestaurant(restaurantId);
  }

  @Put(':restaurantId')
  async updateRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: UpdateRestaurantDto,
  ): Promise<ApiResponse> {
    return this.restaurantService.updateRestaurantDetails(restaurantId, dto);
  }

  @Get('search')
  async findRestaurants(@Query() dto: FindRestaurantDto) {
    return this.restaurantService.findRestaurants(dto);
  }
}
