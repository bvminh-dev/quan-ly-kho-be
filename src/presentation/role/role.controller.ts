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
import { CreateRoleUseCase } from '../../application/role/create-role.usecase.js';
import { GetRolesUseCase } from '../../application/role/get-roles.usecase.js';
import { GetRoleUseCase } from '../../application/role/get-role.usecase.js';
import { UpdateRoleUseCase } from '../../application/role/update-role.usecase.js';
import { DeleteRoleUseCase } from '../../application/role/delete-role.usecase.js';
import { CreateRoleDto } from '../../application/role/dto/create-role.dto.js';
import { UpdateRoleDto } from '../../application/role/dto/update-role.dto.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { User } from '../../common/decorators/user.decorator.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { ICurrentUser } from '../../common/interfaces/current-user.interface.js';
import {
  CreateRoleResponseDto,
  GetRolesResponseDto,
  GetRoleResponseDto,
  UpdateRoleResponseDto,
  DeleteRoleResponseDto,
} from '../../common/swagger/role-response.dto.js';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly getRolesUseCase: GetRolesUseCase,
    private readonly getRoleUseCase: GetRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo role mới' })
  @ApiCreatedResponse({
    description: 'Tạo role thành công',
    type: CreateRoleResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ hoặc role đã tồn tại' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Create a new Role')
  async create(@Body() dto: CreateRoleDto, @User() user: ICurrentUser) {
    return this.createRoleUseCase.execute(dto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách role có phân trang' })
  @ApiOkResponse({
    description: 'Trả về danh sách role với phân trang',
    type: GetRolesResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch list Role with paginate')
  async findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.getRolesUseCase.execute(
      queryString as any,
      +currentPage || 1,
      +pageSize || 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin role theo ID' })
  @ApiOkResponse({
    description: 'Trả về thông tin role',
    type: GetRoleResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy role' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch Role by id')
  async findOne(@Param('id') id: string) {
    return this.getRoleUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật role' })
  @ApiOkResponse({
    description: 'Cập nhật role thành công',
    type: UpdateRoleResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy role' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Update a Role')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
    @User() user: ICurrentUser,
  ) {
    return this.updateRoleUseCase.execute(id, dto, user._id);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Xóa role (soft delete, chỉ Admin, không được xóa admin role)' })
  @ApiOkResponse({
    description: 'Xóa role thành công',
    type: DeleteRoleResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền xóa' })
  @ApiBadRequestResponse({ description: 'Không thể xóa role admin' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy role' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Delete a Role')
  async remove(@Param('id') id: string, @User() user: ICurrentUser) {
    return this.deleteRoleUseCase.execute(id, user._id);
  }
}
