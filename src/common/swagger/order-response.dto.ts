import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './base-response.dto.js';

class OrderItemSwaggerDto {
  @ApiProperty({ example: '60d0fe4f5311236168a109ca' })
  id: string;

  @ApiProperty({ example: 5 })
  quantity: number;

  @ApiProperty({ example: 100 })
  price: number;

  @ApiProperty({ example: 0 })
  sale: number;

  @ApiProperty({ example: false })
  customPrice: boolean;

  @ApiProperty({ example: false })
  customSale: boolean;
}

class OrderProductSwaggerDto {
  @ApiProperty({ example: 'Set A' })
  nameSet: string;

  @ApiProperty({ example: 500 })
  priceSet: number;

  @ApiProperty({ example: 1 })
  quantitySet: number;

  @ApiProperty({ example: 0 })
  saleSet: number;

  @ApiProperty({ example: false })
  isCalcSet: boolean;

  @ApiProperty({ type: () => [OrderItemSwaggerDto] })
  items: OrderItemSwaggerDto[];
}

class OrderHistorySwaggerDto {
  @ApiProperty({ example: 'khách trả' })
  type: string;

  @ApiProperty({ example: 1600 })
  exchangeRate: number;

  @ApiProperty({ example: 50000 })
  moneyPaidNGN: number;

  @ApiProperty({ example: 31.25 })
  moneyPaidDolar: number;

  @ApiProperty({ example: 'Chuyển khoản' })
  paymentMethod: string;

  @ApiProperty({ example: '2026-02-15T11:51:00.000Z' })
  datePaid: Date;

  @ApiProperty({ example: 'Ghi chú' })
  note: string;
}

class OrderCustomerRefDto {
  @ApiProperty({ example: '60d0fe4f5311236168a109cb' })
  _id: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  name: string;
}

class OrderDetailDto {
  @ApiProperty({ example: '60d0fe4f5311236168a109ca' })
  _id: string;

  @ApiProperty({ example: 'cao', description: 'Loại đơn theo giá cao hoặc giá thấp' })
  type: string;

  @ApiProperty({ example: 'Báo giá' })
  state: string;

  @ApiProperty({ example: 1600 })
  exchangeRate: number;

  @ApiProperty({ type: () => OrderCustomerRefDto })
  customer: OrderCustomerRefDto;

  @ApiProperty({ example: 500 })
  totalPrice: number;

  @ApiProperty({ example: -500 })
  payment: number;

  @ApiProperty({ example: 'Ghi chú' })
  note: string;

  @ApiProperty({ type: () => [OrderProductSwaggerDto] })
  products: OrderProductSwaggerDto[];

  @ApiProperty({ type: () => [OrderHistorySwaggerDto] })
  history: OrderHistorySwaggerDto[];

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

class OrderListData {
  @ApiProperty({ type: () => [OrderDetailDto] })
  items: OrderDetailDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class CreateOrderResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Create a new Order' })
  message: string;

  @ApiProperty({ type: () => OrderDetailDto })
  data: OrderDetailDto;
}

export class GetOrdersResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch list Order with paginate' })
  message: string;

  @ApiProperty({ type: () => OrderListData })
  data: OrderListData;
}

export class GetOrderResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch Order by id' })
  message: string;

  @ApiProperty({ type: () => OrderDetailDto })
  data: OrderDetailDto;
}

export class UpdateOrderResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Update a Order' })
  message: string;

  @ApiProperty({ type: () => OrderDetailDto })
  data: OrderDetailDto;
}

export class DeleteOrderResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Delete a Order' })
  message: string;

  @ApiProperty({ example: null, nullable: true, type: String })
  data: string;
}

export class AddHistoryResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Add history to Order' })
  message: string;

  @ApiProperty({ type: () => OrderDetailDto })
  data: OrderDetailDto;
}

export class ConfirmOrderResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Confirm Order' })
  message: string;

  @ApiProperty({ type: () => OrderDetailDto })
  data: OrderDetailDto;
}

export class RevertOrderResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Revert Order' })
  message: string;

  @ApiProperty({ type: () => OrderDetailDto })
  data: OrderDetailDto;
}
