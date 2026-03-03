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
import { CreateQualityUseCase } from '../../application/quality/create-quality.usecase.js';
import { DeleteQualityUseCase } from '../../application/quality/delete-quality.usecase.js';
import { GetQualityUseCase } from '../../application/quality/get-quality.usecase.js';
import { GetQualitysUseCase } from '../../application/quality/get-qualitys.usecase.js';
import { UpdateQualityUseCase } from '../../application/quality/update-quality.usecase.js';
import { CreateQualityDto } from '../../application/quality/dto/create-quality.dto.js';
import { UpdateQualityDto } from '../../application/quality/dto/update-quality.dto.js';
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

@ApiTags('Catalog - Quality')
@Controller('catalog/qualitys')
@Roles('admin')
@UseGuards(RolesGuard)
export class QualityController {
  constructor(
    private readonly createQualityUseCase: CreateQualityUseCase,
    private readonly getQualitysUseCase: GetQualitysUseCase,
    private readonly getQualityUseCase: GetQualityUseCase,
    private readonly updateQualityUseCase: UpdateQualityUseCase,
    private readonly deleteQualityUseCase: DeleteQualityUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo quality mới (chỉ Admin)' })
  @ApiCreatedResponse({
    description: 'Tạo quality thành công',
    type: CreateCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ hoặc đã tồn tại' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Create a new Quality')
  async create(@Body() dto: CreateQualityDto, @User() user: ICurrentUser) {
    return this.createQualityUseCase.execute(dto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách quality có phân trang (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Trả về danh sách quality',
    type: GetCatalogsResponseDto,
  })
  @ApiQuery({ name: 'current', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'sort', required: false, type: String, example: '-createdAt' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch list Quality with paginate')
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
    return this.getQualitysUseCase.execute(
      queryParams.toString(),
      +currentPage || 1,
      +pageSize || 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin quality theo ID (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Trả về thông tin quality',
    type: GetCatalogResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy quality' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch Quality by id')
  async findOne(@Param('id') id: string) {
    return this.getQualityUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật quality (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Cập nhật quality thành công',
    type: UpdateCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy quality' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Update a Quality')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateQualityDto,
    @User() user: ICurrentUser,
  ) {
    return this.updateQualityUseCase.execute(id, dto, user._id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa quality (soft delete, chỉ Admin)' })
  @ApiOkResponse({
    description: 'Xóa quality thành công',
    type: DeleteCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Quality đang được sử dụng trong kho' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy quality' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Delete a Quality')
  async remove(@Param('id') id: string, @User() user: ICurrentUser) {
    return this.deleteQualityUseCase.execute(id, user._id);
  }
}
