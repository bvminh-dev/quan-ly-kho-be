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
import { CreateItemUseCase } from '../../application/item/create-item.usecase.js';
import { DeleteItemUseCase } from '../../application/item/delete-item.usecase.js';
import { GetItemUseCase } from '../../application/item/get-item.usecase.js';
import { GetItemsUseCase } from '../../application/item/get-items.usecase.js';
import { UpdateItemUseCase } from '../../application/item/update-item.usecase.js';
import { CreateItemDto } from '../../application/item/dto/create-item.dto.js';
import { UpdateItemDto } from '../../application/item/dto/update-item.dto.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { User } from '../../common/decorators/user.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
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
@Roles('admin')
@UseGuards(RolesGuard)
export class ItemController {
  constructor(
    private readonly createItemUseCase: CreateItemUseCase,
    private readonly getItemsUseCase: GetItemsUseCase,
    private readonly getItemUseCase: GetItemUseCase,
    private readonly updateItemUseCase: UpdateItemUseCase,
    private readonly deleteItemUseCase: DeleteItemUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo item mới (chỉ Admin)' })
  @ApiCreatedResponse({
    description: 'Tạo item thành công',
    type: CreateCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ hoặc đã tồn tại' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Create a new Item')
  async create(@Body() dto: CreateItemDto, @User() user: ICurrentUser) {
    return this.createItemUseCase.execute(dto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách item có phân trang (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Trả về danh sách item',
    type: GetCatalogsResponseDto,
  })
  @ApiQuery({ name: 'current', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'sort', required: false, type: String, example: '-createdAt' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch list Item with paginate')
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
    return this.getItemsUseCase.execute(
      queryParams.toString(),
      +currentPage || 1,
      +pageSize || 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin item theo ID (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Trả về thông tin item',
    type: GetCatalogResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy item' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch Item by id')
  async findOne(@Param('id') id: string) {
    return this.getItemUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật item (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Cập nhật item thành công',
    type: UpdateCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy item' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Update an Item')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
    @User() user: ICurrentUser,
  ) {
    return this.updateItemUseCase.execute(id, dto, user._id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa item (soft delete, chỉ Admin)' })
  @ApiOkResponse({
    description: 'Xóa item thành công',
    type: DeleteCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Item đang được sử dụng trong kho' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy item' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Delete an Item')
  async remove(@Param('id') id: string, @User() user: ICurrentUser) {
    return this.deleteItemUseCase.execute(id, user._id);
  }
}
