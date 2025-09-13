import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cuisine?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minimumPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maximumPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  openNow?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  radiusKm?: number;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20;
}
