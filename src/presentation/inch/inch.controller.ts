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
import { CreateInchUseCase } from '../../application/inch/create-inch.usecase.js';
import { DeleteInchUseCase } from '../../application/inch/delete-inch.usecase.js';
import { GetInchUseCase } from '../../application/inch/get-inch.usecase.js';
import { GetInchsUseCase } from '../../application/inch/get-inchs.usecase.js';
import { UpdateInchUseCase } from '../../application/inch/update-inch.usecase.js';
import { CreateInchDto } from '../../application/inch/dto/create-inch.dto.js';
import { UpdateInchDto } from '../../application/inch/dto/update-inch.dto.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { User } from '../../common/decorators/user.decorator.js';
import { ICurrentUser } from '../../common/interfaces/current-user.interface.js';
import {
  CreateCatalogResponseDto,
  DeleteCatalogResponseDto,
  GetCatalogResponseDto,
  GetCatalogsResponseDto,
  UpdateCatalogResponseDto,
} from '../../common/swagger/catalog-response.dto.js';

@ApiTags('Catalog - Inch')
@Controller('catalog/inchs')
export class InchController {
  constructor(
    private readonly createInchUseCase: CreateInchUseCase,
    private readonly getInchsUseCase: GetInchsUseCase,
    private readonly getInchUseCase: GetInchUseCase,
    private readonly updateInchUseCase: UpdateInchUseCase,
    private readonly deleteInchUseCase: DeleteInchUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo inch mới' })
  @ApiCreatedResponse({
    description: 'Tạo inch thành công',
    type: CreateCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ hoặc đã tồn tại' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Create a new Inch')
  async create(@Body() dto: CreateInchDto, @User() user: ICurrentUser) {
    return this.createInchUseCase.execute(dto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách inch có phân trang' })
  @ApiOkResponse({
    description: 'Trả về danh sách inch',
    type: GetCatalogsResponseDto,
  })
  @ApiQuery({ name: 'current', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'sort', required: false, type: String, example: '-createdAt' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch list Inch with paginate')
  async findAll(
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
    return this.getInchsUseCase.execute(
      queryParams.toString(),
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

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin inch theo ID' })
  @ApiOkResponse({
    description: 'Trả về thông tin inch',
    type: GetCatalogResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy inch' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch Inch by id')
  async findOne(@Param('id') id: string) {
    return this.getInchUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật inch' })
  @ApiOkResponse({
    description: 'Cập nhật inch thành công',
    type: UpdateCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy inch' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Update a Inch')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateInchDto,
    @User() user: ICurrentUser,
  ) {
    return this.updateInchUseCase.execute(id, dto, user._id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa inch (soft delete)' })
  @ApiOkResponse({
    description: 'Xóa inch thành công',
    type: DeleteCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Inch đang được sử dụng trong kho' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy inch' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Delete a Inch')
  async remove(@Param('id') id: string, @User() user: ICurrentUser) {
    return this.deleteInchUseCase.execute(id, user._id);
  }
}
