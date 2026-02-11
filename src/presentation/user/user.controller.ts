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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserUseCase } from '../../application/user/create-user.usecase.js';
import { DeleteUserUseCase } from '../../application/user/delete-user.usecase.js';
import { CreateUserDto } from '../../application/user/dto/create-user.dto.js';
import { ResetPasswordDto } from '../../application/user/dto/reset-password.dto.js';
import { UpdatePasswordDto } from '../../application/user/dto/update-password.dto.js';
import { UpdateUserDto } from '../../application/user/dto/update-user.dto.js';
import { GetUserUseCase } from '../../application/user/get-user.usecase.js';
import { GetUsersUseCase } from '../../application/user/get-users.usecase.js';
import { ResetPasswordUseCase } from '../../application/user/reset-password.usecase.js';
import { UpdatePasswordUseCase } from '../../application/user/update-password.usecase.js';
import { UpdateUserUseCase } from '../../application/user/update-user.usecase.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { User } from '../../common/decorators/user.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { ICurrentUser } from '../../common/interfaces/current-user.interface.js';
import {
  CreateUserResponseDto,
  DeleteUserResponseDto,
  GetUserResponseDto,
  GetUsersResponseDto,
  ResetPasswordResponseDto,
  UpdatePasswordResponseDto,
  UpdateUserResponseDto,
} from '../../common/swagger/user-response.dto.js';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo user mới (chỉ Admin)' })
  @ApiCreatedResponse({
    description: 'Tạo user thành công',
    type: CreateUserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu không hợp lệ hoặc email đã tồn tại',
  })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Create a new User')
  async create(@Body() dto: CreateUserDto, @User() user: ICurrentUser) {
    return this.createUserUseCase.execute(dto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách user có phân trang' })
  @ApiOkResponse({
    description: 'Trả về danh sách user với phân trang',
    type: GetUsersResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch list User with paginate')
  async findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.getUsersUseCase.execute(
      queryString as any,
      +currentPage || 1,
      +pageSize || 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin user theo ID' })
  @ApiOkResponse({
    description: 'Trả về thông tin user',
    type: GetUserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy user' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch User by id')
  async findOne(@Param('id') id: string) {
    return this.getUserUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin user' })
  @ApiOkResponse({
    description: 'Cập nhật user thành công',
    type: UpdateUserResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy user' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Update a User')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @User() user: ICurrentUser,
  ) {
    return this.updateUserUseCase.execute(id, dto, user._id);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Xóa user (soft delete, chỉ Admin)' })
  @ApiOkResponse({
    description: 'Xóa user thành công',
    type: DeleteUserResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền xóa' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy user' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Delete a User')
  async remove(@Param('id') id: string, @User() user: ICurrentUser) {
    return this.deleteUserUseCase.execute(id, user._id);
  }

  @Patch('password/update')
  @ApiOperation({ summary: 'Đổi mật khẩu (user tự đổi)' })
  @ApiOkResponse({
    description: 'Đổi mật khẩu thành công',
    type: UpdatePasswordResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Mật khẩu hiện tại không đúng' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Update password')
  async updatePassword(
    @Body() dto: UpdatePasswordDto,
    @User() user: ICurrentUser,
  ) {
    return this.updatePasswordUseCase.execute(user._id, dto);
  }

  @Patch('password/reset')
  @ApiOperation({ summary: 'Reset mật khẩu user (chỉ Admin)' })
  @ApiOkResponse({
    description: 'Reset mật khẩu thành công',
    type: ResetPasswordResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Reset password by Admin')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @User() user: ICurrentUser,
  ) {
    return this.resetPasswordUseCase.execute(dto, user._id);
  }
}
