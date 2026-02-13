import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './base-response.dto.js';

class CustomerItemDto {
  @ApiProperty({ example: '60d0fe4f5311236168a109ca' })
  _id: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  name: string;

  @ApiProperty({ example: 0, description: 'Âm = nợ, dương = trả thừa' })
  payment: number;

  @ApiProperty({ example: 'Khách VIP' })
  note: string;

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

class CustomerListData {
  @ApiProperty({ type: () => [CustomerItemDto] })
  items: CustomerItemDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class CreateCustomerResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Create a new Customer' })
  message: string;

  @ApiProperty({ type: () => CustomerItemDto })
  data: CustomerItemDto;
}

export class GetCustomersResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch list Customer with paginate' })
  message: string;

  @ApiProperty({ type: () => CustomerListData })
  data: CustomerListData;
}

export class GetCustomerResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch Customer by id' })
  message: string;

  @ApiProperty({ type: () => CustomerItemDto })
  data: CustomerItemDto;
}

export class UpdateCustomerResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Update a Customer' })
  message: string;

  @ApiProperty({ type: () => CustomerItemDto })
  data: CustomerItemDto;
}

export class DeleteCustomerResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Delete a Customer' })
  message: string;

  @ApiProperty({ example: null, nullable: true, type: String })
  data: string;
}
