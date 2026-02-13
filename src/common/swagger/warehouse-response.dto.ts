import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './base-response.dto.js';

class WarehouseItemDto {
  @ApiProperty({ example: '60d0fe4f5311236168a109ca' })
  _id: string;

  @ApiProperty({ example: 14 })
  inches: number;

  @ApiProperty({ example: 'CLOSURE' })
  item: string;

  @ApiProperty({ example: 'SDD' })
  quality: string;

  @ApiProperty({ example: 'BONESTRAIGHT' })
  style: string;

  @ApiProperty({ example: 'NATURAL' })
  color: string;

  @ApiProperty({ example: 100 })
  totalAmount: number;

  @ApiProperty({ example: 10 })
  amountOccupied: number;

  @ApiProperty({ example: 90 })
  amountAvailable: number;

  @ApiProperty({ example: 'Kg' })
  unitOfCalculation: string;

  @ApiProperty({ example: 500 })
  priceHigh: number;

  @ApiProperty({ example: 300 })
  priceLow: number;

  @ApiProperty({ example: 0 })
  sale: number;

  @ApiProperty({ example: '60d0fe4f5311236168a109cc' })
  createdBy: string;

  @ApiProperty({ example: '60d0fe4f5311236168a109cc' })
  updatedBy: string;

  @ApiProperty({ example: false })
  isDeleted: boolean;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  updatedAt: string;
}

class WarehouseListData {
  @ApiProperty({ type: () => [WarehouseItemDto] })
  items: WarehouseItemDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class CreateWarehouseResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Create a new Warehouse' })
  message: string;

  @ApiProperty({ type: () => WarehouseItemDto })
  data: WarehouseItemDto;
}

export class GetWarehousesResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch list Warehouse with paginate' })
  message: string;

  @ApiProperty({ type: () => WarehouseListData })
  data: WarehouseListData;
}

export class GetWarehouseResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch Warehouse by id' })
  message: string;

  @ApiProperty({ type: () => WarehouseItemDto })
  data: WarehouseItemDto;
}

export class UpdateWarehouseResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Update a Warehouse' })
  message: string;

  @ApiProperty({ type: () => WarehouseItemDto })
  data: WarehouseItemDto;
}

export class DeleteWarehouseResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Delete a Warehouse' })
  message: string;

  @ApiProperty({ example: null, nullable: true, type: String })
  data: string;
}

export class AddStockResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Add stock to Warehouse' })
  message: string;

  @ApiProperty({ type: () => WarehouseItemDto })
  data: WarehouseItemDto;
}
