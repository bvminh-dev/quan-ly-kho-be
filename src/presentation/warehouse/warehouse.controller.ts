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
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AddStockUseCase } from '../../application/warehouse/add-stock.usecase.js';
import { CreateWarehouseUseCase } from '../../application/warehouse/create-warehouse.usecase.js';
import { DeleteWarehouseUseCase } from '../../application/warehouse/delete-warehouse.usecase.js';
import { AddStockBodyDto } from '../../application/warehouse/dto/add-stock.dto.js';
import { CreateWarehouseDto } from '../../application/warehouse/dto/create-warehouse.dto.js';
import { UpdateWarehouseDto } from '../../application/warehouse/dto/update-warehouse.dto.js';
import { GetWarehouseUseCase } from '../../application/warehouse/get-warehouse.usecase.js';
import { GetWarehousesUseCase } from '../../application/warehouse/get-warehouses.usecase.js';
import { UpdateWarehouseUseCase } from '../../application/warehouse/update-warehouse.usecase.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { User } from '../../common/decorators/user.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { ICurrentUser } from '../../common/interfaces/current-user.interface.js';
import {
  AddStockResponseDto,
  CreateWarehouseResponseDto,
  DeleteWarehouseResponseDto,
  GetWarehouseResponseDto,
  GetWarehousesResponseDto,
  UpdateWarehouseResponseDto,
} from '../../common/swagger/warehouse-response.dto.js';

@ApiTags('Warehouses')
@Controller('warehouses')
export class WarehouseController {
  constructor(
    private readonly createWarehouseUseCase: CreateWarehouseUseCase,
    private readonly getWarehousesUseCase: GetWarehousesUseCase,
    private readonly getWarehouseUseCase: GetWarehouseUseCase,
    private readonly updateWarehouseUseCase: UpdateWarehouseUseCase,
    private readonly deleteWarehouseUseCase: DeleteWarehouseUseCase,
    private readonly addStockUseCase: AddStockUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo warehouse mới' })
  @ApiCreatedResponse({
    description: 'Tạo warehouse thành công',
    type: CreateWarehouseResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Create a new Warehouse')
  async create(@Body() dto: CreateWarehouseDto, @User() user: ICurrentUser) {
    return this.createWarehouseUseCase.execute(dto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách warehouse có phân trang' })
  @ApiOkResponse({
    description: 'Trả về danh sách warehouse',
    type: GetWarehousesResponseDto,
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
    description: 'Điều kiện query để tìm kiếm (ví dụ: name=Kho A, address=Hà Nội)',
    type: String,
    example: 'name=Kho A',
  })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch list Warehouse with paginate')
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

    return this.getWarehousesUseCase.execute(
      finalQueryString,
      +currentPage || 1,
      +pageSize || 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin warehouse theo ID' })
  @ApiOkResponse({
    description: 'Trả về thông tin warehouse',
    type: GetWarehouseResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy warehouse' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch Warehouse by id')
  async findOne(@Param('id') id: string) {
    return this.getWarehouseUseCase.execute(id);
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Cập nhật thông tin warehouse (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Cập nhật warehouse thành công',
    type: UpdateWarehouseResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền cập nhật' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy warehouse' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Update a Warehouse')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateWarehouseDto,
    @User() user: ICurrentUser,
  ) {
    return this.updateWarehouseUseCase.execute(id, dto, user._id);
  }

  @Post('add-stock')
  @ApiOperation({ summary: 'Bổ sung hàng hóa vào warehouse' })
  @ApiOkResponse({
    description: 'Bổ sung hàng hóa thành công',
    type: AddStockResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy warehouse' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Add stock to Warehouse')
  async addStock(@Body() dto: AddStockBodyDto, @User() user: ICurrentUser) {
    return this.addStockUseCase.execute(
      { warehouseId: dto.id, quantity: dto.quantity, note: dto.note },
      user._id,
    );
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Xóa warehouse (soft delete, chỉ Admin)' })
  @ApiOkResponse({
    description: 'Xóa warehouse thành công',
    type: DeleteWarehouseResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền xóa' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy warehouse' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Delete a Warehouse')
  async remove(@Param('id') id: string, @User() user: ICurrentUser) {
    return this.deleteWarehouseUseCase.execute(id, user._id);
  }
}
