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
import { CreateStyleUseCase } from '../../application/style/create-style.usecase.js';
import { DeleteStyleUseCase } from '../../application/style/delete-style.usecase.js';
import { GetStyleUseCase } from '../../application/style/get-style.usecase.js';
import { GetStylesUseCase } from '../../application/style/get-styles.usecase.js';
import { UpdateStyleUseCase } from '../../application/style/update-style.usecase.js';
import { CreateStyleDto } from '../../application/style/dto/create-style.dto.js';
import { UpdateStyleDto } from '../../application/style/dto/update-style.dto.js';
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

@ApiTags('Catalog - Style')
@Controller('catalog/styles')
@Roles('admin')
@UseGuards(RolesGuard)
export class StyleController {
  constructor(
    private readonly createStyleUseCase: CreateStyleUseCase,
    private readonly getStylesUseCase: GetStylesUseCase,
    private readonly getStyleUseCase: GetStyleUseCase,
    private readonly updateStyleUseCase: UpdateStyleUseCase,
    private readonly deleteStyleUseCase: DeleteStyleUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo style mới (chỉ Admin)' })
  @ApiCreatedResponse({
    description: 'Tạo style thành công',
    type: CreateCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ hoặc đã tồn tại' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Create a new Style')
  async create(@Body() dto: CreateStyleDto, @User() user: ICurrentUser) {
    return this.createStyleUseCase.execute(dto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách style có phân trang (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Trả về danh sách style',
    type: GetCatalogsResponseDto,
  })
  @ApiQuery({ name: 'current', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'sort', required: false, type: String, example: '-createdAt' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch list Style with paginate')
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
    return this.getStylesUseCase.execute(
      queryParams.toString(),
      +currentPage || 1,
      +pageSize || 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin style theo ID (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Trả về thông tin style',
    type: GetCatalogResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy style' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch Style by id')
  async findOne(@Param('id') id: string) {
    return this.getStyleUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật style (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Cập nhật style thành công',
    type: UpdateCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy style' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Update a Style')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateStyleDto,
    @User() user: ICurrentUser,
  ) {
    return this.updateStyleUseCase.execute(id, dto, user._id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa style (soft delete, chỉ Admin)' })
  @ApiOkResponse({
    description: 'Xóa style thành công',
    type: DeleteCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Style đang được sử dụng trong kho' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy style' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Delete a Style')
  async remove(@Param('id') id: string, @User() user: ICurrentUser) {
    return this.deleteStyleUseCase.execute(id, user._id);
  }
}
