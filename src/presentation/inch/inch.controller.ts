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
import { CreateInchUseCase } from '../../application/inch/create-inch.usecase.js';
import { DeleteInchUseCase } from '../../application/inch/delete-inch.usecase.js';
import { GetInchUseCase } from '../../application/inch/get-inch.usecase.js';
import { GetInchsUseCase } from '../../application/inch/get-inchs.usecase.js';
import { UpdateInchUseCase } from '../../application/inch/update-inch.usecase.js';
import { CreateInchDto } from '../../application/inch/dto/create-inch.dto.js';
import { UpdateInchDto } from '../../application/inch/dto/update-inch.dto.js';
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

@ApiTags('Catalog - Inch')
@Controller('catalog/inchs')
@Roles('admin')
@UseGuards(RolesGuard)
export class InchController {
  constructor(
    private readonly createInchUseCase: CreateInchUseCase,
    private readonly getInchsUseCase: GetInchsUseCase,
    private readonly getInchUseCase: GetInchUseCase,
    private readonly updateInchUseCase: UpdateInchUseCase,
    private readonly deleteInchUseCase: DeleteInchUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo inch mới (chỉ Admin)' })
  @ApiCreatedResponse({
    description: 'Tạo inch thành công',
    type: CreateCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ hoặc đã tồn tại' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Create a new Inch')
  async create(@Body() dto: CreateInchDto, @User() user: ICurrentUser) {
    return this.createInchUseCase.execute(dto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách inch có phân trang (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Trả về danh sách inch',
    type: GetCatalogsResponseDto,
  })
  @ApiQuery({ name: 'current', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'sort', required: false, type: String, example: '-createdAt' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch list Inch with paginate')
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
    return this.getInchsUseCase.execute(
      queryParams.toString(),
      +currentPage || 1,
      +pageSize || 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin inch theo ID (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Trả về thông tin inch',
    type: GetCatalogResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy inch' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch Inch by id')
  async findOne(@Param('id') id: string) {
    return this.getInchUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật inch (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Cập nhật inch thành công',
    type: UpdateCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy inch' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Update an Inch')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateInchDto,
    @User() user: ICurrentUser,
  ) {
    return this.updateInchUseCase.execute(id, dto, user._id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa inch (soft delete, chỉ Admin)' })
  @ApiOkResponse({
    description: 'Xóa inch thành công',
    type: DeleteCatalogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Inch đang được sử dụng trong kho' })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy inch' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Delete an Inch')
  async remove(@Param('id') id: string, @User() user: ICurrentUser) {
    return this.deleteInchUseCase.execute(id, user._id);
  }
}
