import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cuisine: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  open: boolean;
}

export class UpdateRestaurantDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  open?: boolean;
}

export class FindRestaurantDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  longitude: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cuisine?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  minimumPrice?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  maximumPrice?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  openNow?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  radiusKm?: number;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 20;
}
