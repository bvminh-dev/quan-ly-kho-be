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

  @ApiProperty({ example: 'Kg', description: 'Đơn vị tính: Kg hoặc Pcs' })
  unitOfCalculation: string;
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

class OrderCreatorRefDto {
  @ApiProperty({ example: '60d0fe4f5311236168a109cc' })
  _id: string;

  @ApiProperty({ example: 'Nguyễn Văn B' })
  name: string;
}

class OrderDetailDto {
  @ApiProperty({ example: '60d0fe4f5311236168a109ca' })
  _id: string;

  @ApiProperty({
    example: 'cao',
    description: 'Loại đơn theo giá cao hoặc giá thấp',
  })
  type: string;

  @ApiProperty({
    example: 'Báo giá',
    description:
      'Trạng thái đơn hàng: Báo giá | Đã chốt | Chỉnh sửa | Hoàn tác | Đã xong | Đã giao',
  })
  state: string;

  @ApiProperty({ example: 1600 })
  exchangeRate: number;

  @ApiProperty({ type: () => OrderCustomerRefDto })
  customer: OrderCustomerRefDto;

  @ApiProperty({ example: 500 })
  totalPrice: number;

  @ApiProperty({ example: -500 })
  payment: number;

  @ApiProperty({
    example: 500000,
    description: 'Số tiền khách nợ cần trả vào hoá đơn này',
  })
  debt: number;

  @ApiProperty({
    example: 100000,
    description: 'Số tiền khách trả dư, được trừ ở hoá đơn này',
  })
  paid: number;

  @ApiProperty({ example: 'Ghi chú' })
  note: string;

  @ApiProperty({ type: () => [OrderProductSwaggerDto] })
  products: OrderProductSwaggerDto[];

  @ApiProperty({ type: () => [OrderHistorySwaggerDto] })
  history: OrderHistorySwaggerDto[];

  @ApiProperty({
    type: () => OrderCreatorRefDto,
    description: 'Thông tin người tạo đơn hàng',
    nullable: true,
  })
  createdBy: OrderCreatorRefDto | string | null;

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

export class DeliverOrderResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Deliver Order' })
  message: string;

  @ApiProperty({ type: () => OrderDetailDto })
  data: OrderDetailDto;
}
