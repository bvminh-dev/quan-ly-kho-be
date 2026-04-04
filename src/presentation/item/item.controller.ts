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
import { CreateItemUseCase } from '../../application/item/create-item.usecase.js';
import { DeleteItemUseCase } from '../../application/item/delete-item.usecase.js';
import { GetItemUseCase } from '../../application/item/get-item.usecase.js';
import { GetItemsUseCase } from '../../application/item/get-items.usecase.js';
import { UpdateItemUseCase } from '../../application/item/update-item.usecase.js';
import { CreateItemDto } from '../../application/item/dto/create-item.dto.js';
import { UpdateItemDto } from '../../application/item/dto/update-item.dto.js';
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

@ApiTags('Catalog - Item')
@Controller('catalog/items')
export class ItemController {
  constructor(
    private readonly createItemUseCase: CreateItemUseCase,
    private readonly getItemsUseCase: GetItemsUseCase,
    private readonly getItemUseCase: GetItemUseCase,
    private readonly updateItemUseCase: UpdateItemUseCase,
    private readonly deleteItemUseCase: DeleteItemUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo item mới' })
  @ApiCreatedResponse({
    description: 'Tạo item thành công',
    type: CreateCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ hoặc đã tồn tại' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Create a new Item')
  async create(@Body() dto: CreateItemDto, @User() user: ICurrentUser) {
    return this.createItemUseCase.execute(dto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách item có phân trang' })
  @ApiOkResponse({
    description: 'Trả về danh sách item',
    type: GetCatalogsResponseDto,
  })
  @ApiQuery({ name: 'current', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'sort', required: false, type: String, example: '-createdAt' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch list Item with paginate')
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
    return this.getItemsUseCase.execute(
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
  @ApiOperation({ summary: 'Lấy thông tin item theo ID' })
  @ApiOkResponse({
    description: 'Trả về thông tin item',
    type: GetCatalogResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy item' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch Item by id')
  async findOne(@Param('id') id: string) {
    return this.getItemUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật item' })
  @ApiOkResponse({
    description: 'Cập nhật item thành công',
    type: UpdateCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy item' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Update a Item')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
    @User() user: ICurrentUser,
  ) {
    return this.updateItemUseCase.execute(id, dto, user._id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa item (soft delete)' })
  @ApiOkResponse({
    description: 'Xóa item thành công',
    type: DeleteCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Item đang được sử dụng trong kho' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy item' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Delete a Item')
  async remove(@Param('id') id: string, @User() user: ICurrentUser) {
    return this.deleteItemUseCase.execute(id, user._id);
  }
}
