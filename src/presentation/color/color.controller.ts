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
import { CreateColorUseCase } from '../../application/color/create-color.usecase.js';
import { DeleteColorUseCase } from '../../application/color/delete-color.usecase.js';
import { GetColorUseCase } from '../../application/color/get-color.usecase.js';
import { GetColorsUseCase } from '../../application/color/get-colors.usecase.js';
import { UpdateColorUseCase } from '../../application/color/update-color.usecase.js';
import { CreateColorDto } from '../../application/color/dto/create-color.dto.js';
import { UpdateColorDto } from '../../application/color/dto/update-color.dto.js';
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

@ApiTags('Catalog - Color')
@Controller('catalog/colors')
@Roles('admin')
@UseGuards(RolesGuard)
export class ColorController {
  constructor(
    private readonly createColorUseCase: CreateColorUseCase,
    private readonly getColorsUseCase: GetColorsUseCase,
    private readonly getColorUseCase: GetColorUseCase,
    private readonly updateColorUseCase: UpdateColorUseCase,
    private readonly deleteColorUseCase: DeleteColorUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo color mới (chỉ Admin)' })
  @ApiCreatedResponse({
    description: 'Tạo color thành công',
    type: CreateCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ hoặc đã tồn tại' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Create a new Color')
  async create(@Body() dto: CreateColorDto, @User() user: ICurrentUser) {
    return this.createColorUseCase.execute(dto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách color có phân trang (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Trả về danh sách color',
    type: GetCatalogsResponseDto,
  })
  @ApiQuery({ name: 'current', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'sort', required: false, type: String, example: '-createdAt' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch list Color with paginate')
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
    return this.getColorsUseCase.execute(
      queryParams.toString(),
      +currentPage || 1,
      +pageSize || 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin color theo ID (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Trả về thông tin color',
    type: GetCatalogResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy color' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch Color by id')
  async findOne(@Param('id') id: string) {
    return this.getColorUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật color (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Cập nhật color thành công',
    type: UpdateCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy color' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Update a Color')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateColorDto,
    @User() user: ICurrentUser,
  ) {
    return this.updateColorUseCase.execute(id, dto, user._id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa color (soft delete, chỉ Admin)' })
  @ApiOkResponse({
    description: 'Xóa color thành công',
    type: DeleteCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Color đang được sử dụng trong kho' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy color' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Delete a Color')
  async remove(@Param('id') id: string, @User() user: ICurrentUser) {
    return this.deleteColorUseCase.execute(id, user._id);
  }
}
