import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AddHistoryUseCase } from '../../application/order/add-history.usecase.js';
import { ConfirmOrderUseCase } from '../../application/order/confirm-order.usecase.js';
import { CreateOrderUseCase } from '../../application/order/create-order.usecase.js';
import { DeleteOrderUseCase } from '../../application/order/delete-order.usecase.js';
import { AddHistoryDto } from '../../application/order/dto/add-history.dto.js';
import { CreateOrderDto } from '../../application/order/dto/create-order.dto.js';
import { RevertOrderDto } from '../../application/order/dto/revert-order.dto.js';
import { UpdateOrderDto } from '../../application/order/dto/update-order.dto.js';
import { GetOrderUseCase } from '../../application/order/get-order.usecase.js';
import { GetOrdersUseCase } from '../../application/order/get-orders.usecase.js';
import { RevertOrderUseCase } from '../../application/order/revert-order.usecase.js';
import { UpdateOrderUseCase } from '../../application/order/update-order.usecase.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { User } from '../../common/decorators/user.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { ICurrentUser } from '../../common/interfaces/current-user.interface.js';
import {
  AddHistoryResponseDto,
  ConfirmOrderResponseDto,
  CreateOrderResponseDto,
  DeleteOrderResponseDto,
  GetOrderResponseDto,
  GetOrdersResponseDto,
  RevertOrderResponseDto,
  UpdateOrderResponseDto,
} from '../../common/swagger/order-response.dto.js';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrdersUseCase: GetOrdersUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly deleteOrderUseCase: DeleteOrderUseCase,
    private readonly addHistoryUseCase: AddHistoryUseCase,
    private readonly confirmOrderUseCase: ConfirmOrderUseCase,
    private readonly revertOrderUseCase: RevertOrderUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng mới (state mặc định: Báo giá)' })
  @ApiCreatedResponse({
    description: 'Tạo đơn hàng thành công',
    type: CreateOrderResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Create a new Order')
  async create(@Body() dto: CreateOrderDto, @User() user: ICurrentUser) {
    return this.createOrderUseCase.execute(dto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng có phân trang' })
  @ApiOkResponse({
    description: 'Trả về danh sách đơn hàng',
    type: GetOrdersResponseDto,
  })
  @ApiQuery({
    name: 'current',
    required: false,
    description: 'Số trang hiện tại (mặc định: 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Số lượng bản ghi mỗi trang (mặc định: 10)',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description:
      'Sắp xếp theo field (ví dụ: -createdAt để giảm dần, createdAt để tăng dần)',
    type: String,
    example: '-createdAt',
  })
  @ApiQuery({
    name: 'queryString',
    required: false,
    description:
      'Điều kiện query để tìm kiếm (ví dụ: orderCode=ORD001, customer.name=John)',
    type: String,
    example: 'orderCode=ORD001',
  })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch list Order with paginate')
  async findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() query: Record<string, any>,
  ) {
    const queryParams = new URLSearchParams();

    Object.keys(query).forEach((key) => {
      if (
        key !== 'current' &&
        key !== 'pageSize' &&
        query[key] !== undefined &&
        query[key] !== null
      ) {
        queryParams.append(key, String(query[key]));
      }
    });

    const finalQueryString = queryParams.toString();

    return this.getOrdersUseCase.execute(
      finalQueryString,
      +currentPage || 1,
      +pageSize || 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin đơn hàng theo ID' })
  @ApiOkResponse({
    description: 'Trả về thông tin đơn hàng',
    type: GetOrderResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đơn hàng' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch Order by id')
  async findOne(@Param('id') id: string) {
    return this.getOrderUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary:
      'Cập nhật đơn hàng (state chuyển sang chỉnh sửa nếu thay đổi products)',
  })
  @ApiOkResponse({
    description: 'Cập nhật đơn hàng thành công',
    type: UpdateOrderResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đơn hàng' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Update a Order')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
    @User() user: ICurrentUser,
  ) {
    return this.updateOrderUseCase.execute(id, dto, user._id);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Xóa đơn hàng (soft delete, chỉ Admin)' })
  @ApiOkResponse({
    description: 'Xóa đơn hàng thành công',
    type: DeleteOrderResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền xóa' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đơn hàng' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Delete a Order')
  async remove(@Param('id') id: string, @User() user: ICurrentUser) {
    return this.deleteOrderUseCase.execute(id, user._id);
  }

  @Post(':id/history')
  @ApiOperation({ summary: 'Thêm lịch sử thanh toán cho đơn hàng' })
  @ApiOkResponse({
    description: 'Thêm lịch sử thành công',
    type: AddHistoryResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đơn hàng' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Add history to Order')
  async addHistory(@Param('id') id: string, @Body() dto: AddHistoryDto) {
    return this.addHistoryUseCase.execute(id, dto);
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Chốt đơn hàng (chuyển state sang đã chốt)' })
  @ApiOkResponse({
    description: 'Chốt đơn hàng thành công',
    type: ConfirmOrderResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Không thể chốt đơn hàng' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đơn hàng' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Confirm Order')
  async confirm(@Param('id') id: string, @User() user: ICurrentUser) {
    return this.confirmOrderUseCase.execute(id, user._id);
  }

  @Patch(':id/revert')
  @ApiOperation({ summary: 'Hoàn tác đơn hàng (trả lại hàng vào kho)' })
  @ApiBody({ type: RevertOrderDto })
  @ApiOkResponse({
    description: 'Hoàn tác đơn hàng thành công',
    type: RevertOrderResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Không thể hoàn tác đơn hàng' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đơn hàng' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Revert Order')
  async revert(
    @Param('id') id: string,
    @Body() dto: RevertOrderDto,
    @User() user: ICurrentUser,
  ) {
    return this.revertOrderUseCase.execute(id, dto, user._id);
  }
}
