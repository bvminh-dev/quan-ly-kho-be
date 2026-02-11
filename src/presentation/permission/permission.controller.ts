import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreatePermissionUseCase } from '../../application/permission/create-permission.usecase.js';
import { GetPermissionsUseCase } from '../../application/permission/get-permissions.usecase.js';
import { GetPermissionUseCase } from '../../application/permission/get-permission.usecase.js';
import { UpdatePermissionUseCase } from '../../application/permission/update-permission.usecase.js';
import { DeletePermissionUseCase } from '../../application/permission/delete-permission.usecase.js';
import { CreatePermissionDto } from '../../application/permission/dto/create-permission.dto.js';
import { UpdatePermissionDto } from '../../application/permission/dto/update-permission.dto.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { User } from '../../common/decorators/user.decorator.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { ICurrentUser } from '../../common/interfaces/current-user.interface.js';
import {
  CreatePermissionResponseDto,
  GetPermissionsResponseDto,
  GetPermissionResponseDto,
  UpdatePermissionResponseDto,
  DeletePermissionResponseDto,
} from '../../common/swagger/permission-response.dto.js';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly getPermissionsUseCase: GetPermissionsUseCase,
    private readonly getPermissionUseCase: GetPermissionUseCase,
    private readonly updatePermissionUseCase: UpdatePermissionUseCase,
    private readonly deletePermissionUseCase: DeletePermissionUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo permission mới' })
  @ApiCreatedResponse({
    description: 'Tạo permission thành công',
    type: CreatePermissionResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Create a new Permission')
  async create(
    @Body() dto: CreatePermissionDto,
    @User() user: ICurrentUser,
  ) {
    return this.createPermissionUseCase.execute(dto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách permission có phân trang' })
  @ApiOkResponse({
    description: 'Trả về danh sách permission với phân trang',
    type: GetPermissionsResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch list Permission with paginate')
  async findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.getPermissionsUseCase.execute(
      queryString as any,
      +currentPage || 1,
      +pageSize || 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin permission theo ID' })
  @ApiOkResponse({
    description: 'Trả về thông tin permission',
    type: GetPermissionResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy permission' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch Permission by id')
  async findOne(@Param('id') id: string) {
    return this.getPermissionUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật permission' })
  @ApiOkResponse({
    description: 'Cập nhật permission thành công',
    type: UpdatePermissionResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy permission' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Update a Permission')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePermissionDto,
    @User() user: ICurrentUser,
  ) {
    return this.updatePermissionUseCase.execute(id, dto, user._id);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Xóa permission (soft delete, chỉ Admin)' })
  @ApiOkResponse({
    description: 'Xóa permission thành công',
    type: DeletePermissionResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền xóa' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy permission' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Delete a Permission')
  async remove(@Param('id') id: string, @User() user: ICurrentUser) {
    return this.deletePermissionUseCase.execute(id, user._id);
  }
}
