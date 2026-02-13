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
import { CreateCustomerUseCase } from '../../application/customer/create-customer.usecase.js';
import { DeleteCustomerUseCase } from '../../application/customer/delete-customer.usecase.js';
import { CreateCustomerDto } from '../../application/customer/dto/create-customer.dto.js';
import { UpdateCustomerDto } from '../../application/customer/dto/update-customer.dto.js';
import { GetCustomerUseCase } from '../../application/customer/get-customer.usecase.js';
import { GetCustomersUseCase } from '../../application/customer/get-customers.usecase.js';
import { UpdateCustomerUseCase } from '../../application/customer/update-customer.usecase.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { User } from '../../common/decorators/user.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { ICurrentUser } from '../../common/interfaces/current-user.interface.js';
import {
  CreateCustomerResponseDto,
  DeleteCustomerResponseDto,
  GetCustomerResponseDto,
  GetCustomersResponseDto,
  UpdateCustomerResponseDto,
} from '../../common/swagger/customer-response.dto.js';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getCustomersUseCase: GetCustomersUseCase,
    private readonly getCustomerUseCase: GetCustomerUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo customer mới' })
  @ApiCreatedResponse({ description: 'Tạo customer thành công', type: CreateCustomerResponseDto })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ hoặc tên đã tồn tại' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Create a new Customer')
  async create(@Body() dto: CreateCustomerDto, @User() user: ICurrentUser) {
    return this.createCustomerUseCase.execute(dto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách customer có phân trang' })
  @ApiOkResponse({ description: 'Trả về danh sách customer', type: GetCustomersResponseDto })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch list Customer with paginate')
  async findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.getCustomersUseCase.execute(queryString as any, +currentPage || 1, +pageSize || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin customer theo ID' })
  @ApiOkResponse({ description: 'Trả về thông tin customer', type: GetCustomerResponseDto })
  @ApiNotFoundResponse({ description: 'Không tìm thấy customer' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Fetch Customer by id')
  async findOne(@Param('id') id: string) {
    return this.getCustomerUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin customer' })
  @ApiOkResponse({ description: 'Cập nhật customer thành công', type: UpdateCustomerResponseDto })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy customer' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Update a Customer')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
    @User() user: ICurrentUser,
  ) {
    return this.updateCustomerUseCase.execute(id, dto, user._id);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Xóa customer (soft delete, chỉ Admin)' })
  @ApiOkResponse({ description: 'Xóa customer thành công', type: DeleteCustomerResponseDto })
  @ApiForbiddenResponse({ description: 'Chỉ Admin mới có quyền xóa' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy customer' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ResponseMessage('Delete a Customer')
  async remove(@Param('id') id: string, @User() user: ICurrentUser) {
    return this.deleteCustomerUseCase.execute(id, user._id);
  }
}
