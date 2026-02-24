import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './base-response.dto.js';

class HistoryEnterMetadataSwaggerDto {
  @ApiProperty({ example: 100, required: false })
  totalAmount?: number;

  @ApiProperty({ example: 500, required: false })
  priceHigh?: number;

  @ApiProperty({ example: 300, required: false })
  priceLow?: number;

  @ApiProperty({ example: 0, required: false })
  sale?: number;

  @ApiProperty({ example: 50, required: false })
  quantity?: number;

  @ApiProperty({ example: 10, required: false })
  quantityRevert?: number;

  @ApiProperty({
    type: 'string',
    example: '60d0fe4f5311236168a109ca',
    required: false,
    description:
      'ID order (string) hoặc object order khi được populate. Có thể là string hoặc OrderRefDto object.',
  })
  orderId?: string | OrderRefDto;

  @ApiProperty({ example: 600, required: false })
  priceHighNew?: number;

  @ApiProperty({ example: 500, required: false })
  priceHighOld?: number;

  @ApiProperty({ example: 400, required: false })
  priceLowNew?: number;

  @ApiProperty({ example: 300, required: false })
  priceLowOld?: number;

  @ApiProperty({ example: 10, required: false })
  saleNew?: number;

  @ApiProperty({ example: 0, required: false })
  saleOld?: number;
}

class WarehouseRefDto {
  @ApiProperty({ example: '60d0fe4f5311236168a109cb' })
  _id: string;

  @ApiProperty({ example: 'CLOSURE' })
  item: string;

  @ApiProperty({ example: 14 })
  inches: number;

  @ApiProperty({ example: 'SDD' })
  quality: string;

  @ApiProperty({ example: 'BONESTRAIGHT' })
  style: string;

  @ApiProperty({ example: 'NATURAL' })
  color: string;

  @ApiProperty({ example: 500 })
  priceHigh: number;

  @ApiProperty({ example: 300 })
  priceLow: number;

  @ApiProperty({ example: 0 })
  sale: number;

  @ApiProperty({ example: 100 })
  totalAmount: number;

  @ApiProperty({ example: 50 })
  amountOccupied: number;

  @ApiProperty({ example: 50 })
  amountAvailable: number;
}

class OrderRefDto {
  @ApiProperty({ example: '60d0fe4f5311236168a109ca' })
  _id: string;

  @ApiProperty({ example: 'cao' })
  type: string;

  @ApiProperty({ example: 'báo giá' })
  state: string;

  @ApiProperty({ example: 500 })
  totalPrice: number;

  @ApiProperty({ example: -500 })
  payment: number;

  @ApiProperty({ example: '60d0fe4f5311236168a109cb' })
  customer: string;

  @ApiProperty({ example: 'Ghi chú' })
  note: string;
}

class HistoryEnterDetailDto {
  @ApiProperty({ example: '60d0fe4f5311236168a109ca' })
  _id: string;

  @ApiProperty({
    type: 'string',
    example: '60d0fe4f5311236168a109cb',
    description:
      'ID warehouse (string) hoặc object warehouse khi được populate. Có thể là string hoặc WarehouseRefDto object.',
  })
  warehouseId: string | WarehouseRefDto;

  @ApiProperty({ example: 'CLOSURE' })
  item: string;

  @ApiProperty({ example: 14 })
  inches: number;

  @ApiProperty({ example: 'SDD' })
  quality: string;

  @ApiProperty({ example: 'BONESTRAIGHT' })
  style: string;

  @ApiProperty({ example: 'NATURAL' })
  color: string;

  @ApiProperty({ example: 'Tạo mới' })
  type: string;

  @ApiProperty({ type: HistoryEnterMetadataSwaggerDto })
  metadata: HistoryEnterMetadataSwaggerDto;

  @ApiProperty({ example: 'Ghi chú', required: false })
  note?: string;

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

class HistoryEnterListData {
  @ApiProperty({ type: () => [HistoryEnterDetailDto] })
  items: HistoryEnterDetailDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class CreateHistoryEnterResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Create a new History Enter' })
  message: string;

  @ApiProperty({ type: () => HistoryEnterDetailDto })
  data: HistoryEnterDetailDto;
}

export class GetHistoryEntersResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch list History Enter with paginate' })
  message: string;

  @ApiProperty({ type: () => HistoryEnterListData })
  data: HistoryEnterListData;
}

export class GetHistoryEnterResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch History Enter by id' })
  message: string;

  @ApiProperty({ type: () => HistoryEnterDetailDto })
  data: HistoryEnterDetailDto;
}

export class UpdateHistoryEnterResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Update a History Enter' })
  message: string;

  @ApiProperty({ type: () => HistoryEnterDetailDto })
  data: HistoryEnterDetailDto;
}

export class DeleteHistoryEnterResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Delete a History Enter' })
  message: string;

  @ApiProperty({ example: null, nullable: true, type: String })
  data: string;
}

class HistoryExportDetailDto {
  @ApiProperty({ example: '60d0fe4f5311236168a109ca' })
  _id: string;

  @ApiProperty({
    type: 'string',
    example: '60d0fe4f5311236168a109cb',
    description:
      'ID warehouse (string) hoặc object warehouse khi được populate. Có thể là string hoặc WarehouseRefDto object.',
  })
  warehouseId: string | WarehouseRefDto;

  @ApiProperty({ example: 'CLOSURE' })
  item: string;

  @ApiProperty({ example: 14 })
  inches: number;

  @ApiProperty({ example: 'SDD' })
  quality: string;

  @ApiProperty({ example: 'BONESTRAIGHT' })
  style: string;

  @ApiProperty({ example: 'NATURAL' })
  color: string;

  @ApiProperty({ example: 500 })
  priceHigh: number;

  @ApiProperty({ example: 300 })
  priceLow: number;

  @ApiProperty({ example: 0 })
  sale: number;

  @ApiProperty({
    type: 'string',
    example: '60d0fe4f5311236168a109cd',
    description:
      'ID order (string) hoặc object order khi được populate. Có thể là string hoặc OrderRefDto object.',
  })
  orderId: string | OrderRefDto;

  @ApiProperty({ example: 'cao' })
  type: string;

  @ApiProperty({ example: 500 })
  priceOrder: number;

  @ApiProperty({ example: 0 })
  saleOrder: number;

  @ApiProperty({ example: 10 })
  quantityOrder: number;

  @ApiProperty({ example: 'Khách trả' })
  stateOrder: string;

  @ApiProperty({ example: 5000 })
  paymentOrder: number;

  @ApiProperty({ example: 'Ghi chú', required: false })
  note?: string;

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

class HistoryExportListData {
  @ApiProperty({ type: () => [HistoryExportDetailDto] })
  items: HistoryExportDetailDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class CreateHistoryExportResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Create a new History Export' })
  message: string;

  @ApiProperty({ type: () => HistoryExportDetailDto })
  data: HistoryExportDetailDto;
}

export class GetHistoryExportsResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch list History Export with paginate' })
  message: string;

  @ApiProperty({ type: () => HistoryExportListData })
  data: HistoryExportListData;
}

export class GetHistoryExportResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch History Export by id' })
  message: string;

  @ApiProperty({ type: () => HistoryExportDetailDto })
  data: HistoryExportDetailDto;
}

export class UpdateHistoryExportResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Update a History Export' })
  message: string;

  @ApiProperty({ type: () => HistoryExportDetailDto })
  data: HistoryExportDetailDto;
}

export class DeleteHistoryExportResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Delete a History Export' })
  message: string;

  @ApiProperty({ example: null, nullable: true, type: String })
  data: string;
}
