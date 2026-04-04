import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateHistoryEnterUseCase } from '../../application/history-warehouse/create-history-enter.usecase.js';
import { DeleteHistoryEnterUseCase } from '../../application/history-warehouse/delete-history-enter.usecase.js';
import { CreateHistoryEnterDto } from '../../application/history-warehouse/dto/create-history-enter.dto.js';
import { UpdateHistoryEnterDto } from '../../application/history-warehouse/dto/update-history-enter.dto.js';
import { GetHistoryEnterUseCase } from '../../application/history-warehouse/get-history-enter.usecase.js';
import { GetHistoryEntersUseCase } from '../../application/history-warehouse/get-history-enters.usecase.js';
import { UpdateHistoryEnterUseCase } from '../../application/history-warehouse/update-history-enter.usecase.js';
import { CreateHistoryExportUseCase } from '../../application/history-warehouse/create-history-export.usecase.js';
import { DeleteHistoryExportUseCase } from '../../application/history-warehouse/delete-history-export.usecase.js';
import { CreateHistoryExportDto } from '../../application/history-warehouse/dto/create-history-export.dto.js';
import { UpdateHistoryExportDto } from '../../application/history-warehouse/dto/update-history-export.dto.js';
import { GetHistoryExportUseCase } from '../../application/history-warehouse/get-history-export.usecase.js';
import { GetHistoryExportsUseCase } from '../../application/history-warehouse/get-history-exports.usecase.js';
import { UpdateHistoryExportUseCase } from '../../application/history-warehouse/update-history-export.usecase.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { User } from '../../common/decorators/user.decorator.js';
import { ICurrentUser } from '../../common/interfaces/current-user.interface.js';
import {
  CreateHistoryEnterResponseDto,
  DeleteHistoryEnterResponseDto,
  GetHistoryEnterResponseDto,
  GetHistoryEntersResponseDto,
  UpdateHistoryEnterResponseDto,
  CreateHistoryExportResponseDto,
  DeleteHistoryExportResponseDto,
  GetHistoryExportResponseDto,
  GetHistoryExportsResponseDto,
  UpdateHistoryExportResponseDto,
} from '../../common/swagger/history-warehouse-response.dto.js';

@ApiTags('History Warehouse')
@Controller('history-warehouse')
export class HistoryWarehouseController {
  constructor(
    private readonly createHistoryEnterUseCase: CreateHistoryEnterUseCase,
    private readonly getHistoryEntersUseCase: GetHistoryEntersUseCase,
    private readonly getHistoryEnterUseCase: GetHistoryEnterUseCase,
    private readonly updateHistoryEnterUseCase: UpdateHistoryEnterUseCase,
    private readonly deleteHistoryEnterUseCase: DeleteHistoryEnterUseCase,
    private readonly createHistoryExportUseCase: CreateHistoryExportUseCase,
    private readonly getHistoryExportsUseCase: GetHistoryExportsUseCase,
    private readonly getHistoryExportUseCase: GetHistoryExportUseCase,
    private readonly updateHistoryExportUseCase: UpdateHistoryExportUseCase,
    private readonly deleteHistoryExportUseCase: DeleteHistoryExportUseCase,
  ) {}

  @Post('enter')
  @ApiOperation({ summary: 'Tạo history enter mới (chỉ Admin)' })
  @ApiCreatedResponse({
    description: 'Tạo history enter thành công',
    type: CreateHistoryEnterResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Create a new History Enter')
  async createEnter(
    @Body() dto: CreateHistoryEnterDto,
    @User() user: ICurrentUser,
  ) {
    return this.createHistoryEnterUseCase.execute(dto, user._id);
  }

  @Get('enter')
  @ApiOperation({ summary: 'Lấy danh sách history enter có phân trang' })
  @ApiOkResponse({
    description: 'Trả về danh sách history enter',
    type: GetHistoryEntersResponseDto,
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
      'Điều kiện query để tìm kiếm (ví dụ: warehouseId=xxx, type=Tạo mới)',
    type: String,
    example: 'warehouseId=60d0fe4f5311236168a109ca',
  })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch list History Enter with paginate')
  async findAllEnter(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() query: Record<string, any>,
    @User() user: ICurrentUser,
    @Req() req: Request,
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

    return this.getHistoryEntersUseCase.execute(
      finalQueryString,
      +currentPage || 1,
      +pageSize || 10,
      user._id,
      user.role?.name,
      user.role?.isViewAllUser,
      user.role?.viewAllUserApis,
      req.path,
      req.method,
    );
  }

  @Get('enter/:id')
  @ApiOperation({ summary: 'Lấy thông tin history enter theo ID' })
  @ApiOkResponse({
    description: 'Trả về thông tin history enter',
    type: GetHistoryEnterResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy history enter' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch History Enter by id')
  async findOneEnter(@Param('id') id: string) {
    return this.getHistoryEnterUseCase.execute(id);
  }

  @Patch('enter/:id')
  @ApiOperation({ summary: 'Cập nhật thông tin history enter (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Cập nhật history enter thành công',
    type: UpdateHistoryEnterResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy history enter' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Update a History Enter')
  async updateEnter(
    @Param('id') id: string,
    @Body() dto: UpdateHistoryEnterDto,
    @User() user: ICurrentUser,
  ) {
    return this.updateHistoryEnterUseCase.execute(id, dto, user._id);
  }

  @Delete('enter/:id')
  @ApiOperation({ summary: 'Xóa history enter (soft delete, chỉ Admin)' })
  @ApiOkResponse({
    description: 'Xóa history enter thành công',
    type: DeleteHistoryEnterResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy history enter' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Delete a History Enter')
  async removeEnter(@Param('id') id: string, @User() user: ICurrentUser) {
    return this.deleteHistoryEnterUseCase.execute(id, user._id);
  }

  @Post('export')
  @ApiOperation({ summary: 'Tạo history export mới (chỉ Admin)' })
  @ApiCreatedResponse({
    description: 'Tạo history export thành công',
    type: CreateHistoryExportResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Create a new History Export')
  async createExport(
    @Body() dto: CreateHistoryExportDto,
    @User() user: ICurrentUser,
  ) {
    return this.createHistoryExportUseCase.execute(dto, user._id);
  }

  @Get('export')
  @ApiOperation({ summary: 'Lấy danh sách history export có phân trang' })
  @ApiOkResponse({
    description: 'Trả về danh sách history export',
    type: GetHistoryExportsResponseDto,
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
      'Điều kiện query để tìm kiếm (ví dụ: warehouseId=xxx, orderId=xxx)',
    type: String,
    example: 'warehouseId=60d0fe4f5311236168a109ca',
  })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch list History Export with paginate')
  async findAllExport(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() query: Record<string, any>,
    @User() user: ICurrentUser,
    @Req() req: Request,
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

    return this.getHistoryExportsUseCase.execute(
      finalQueryString,
      +currentPage || 1,
      +pageSize || 10,
      user._id,
      user.role?.name,
      user.role?.isViewAllUser,
      user.role?.viewAllUserApis,
      req.path,
      req.method,
    );
  }

  @Get('export/:id')
  @ApiOperation({ summary: 'Lấy thông tin history export theo ID' })
  @ApiOkResponse({
    description: 'Trả về thông tin history export',
    type: GetHistoryExportResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy history export' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch History Export by id')
  async findOneExport(@Param('id') id: string) {
    return this.getHistoryExportUseCase.execute(id);
  }

  @Patch('export/:id')
  @ApiOperation({ summary: 'Cập nhật thông tin history export (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Cập nhật history export thành công',
    type: UpdateHistoryExportResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy history export' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Update a History Export')
  async updateExport(
    @Param('id') id: string,
    @Body() dto: UpdateHistoryExportDto,
    @User() user: ICurrentUser,
  ) {
    return this.updateHistoryExportUseCase.execute(id, dto, user._id);
  }

  @Delete('export/:id')
  @ApiOperation({ summary: 'Xóa history export (soft delete, chỉ Admin)' })
  @ApiOkResponse({
    description: 'Xóa history export thành công',
    type: DeleteHistoryExportResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy history export' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Delete a History Export')
  async removeExport(@Param('id') id: string, @User() user: ICurrentUser) {
    return this.deleteHistoryExportUseCase.execute(id, user._id);
  }
}
