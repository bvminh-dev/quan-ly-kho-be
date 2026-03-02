/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Model } from 'mongoose';
import {
  Permission,
  PermissionDocument,
} from '../../infrastructure/mongo/permission/permission.schema.js';
import {
  Role,
  RoleDocument,
} from '../../infrastructure/mongo/role/role.schema.js';
import {
  User,
  UserDocument,
} from '../../infrastructure/mongo/user/user.schema.js';

@Injectable()
export class DatabaseSeederService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeederService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<PermissionDocument>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const userCount = await this.userModel.countDocuments();
    if (userCount > 0) {
      this.logger.log('Database already seeded. Skipping...');
      return;
    }

    this.logger.log('Seeding database...');

    // Step 1: Create permissions
    const permissions = await this.createPermissions();
    this.logger.log(`Created ${permissions.length} permissions`);

    // Step 2: Create roles with permissions
    const { adminRole, userRole } = await this.createRoles(permissions);
    this.logger.log('Created admin and user roles');

    // Step 3: Create users with roles
    await this.createUsers(adminRole._id, userRole._id);
    this.logger.log('Created admin and user accounts');

    this.logger.log('Database seeded successfully!');
  }

  private async createPermissions() {
    const initPermissions = [
      // Auth module
      {
        name: 'Đăng xuất',
        apiPath: '/api/v1/auth/logout',
        method: 'POST',
        module: 'auth',
        description: 'Đăng xuất khỏi hệ thống',
      },
      {
        name: 'Xem thông tin tài khoản',
        apiPath: '/api/v1/auth/account',
        method: 'GET',
        module: 'auth',
        description: 'Xem thông tin tài khoản đang đăng nhập',
      },

      // User module
      {
        name: 'Tạo người dùng',
        apiPath: '/api/v1/users',
        method: 'POST',
        module: 'users',
        description: 'Tạo tài khoản người dùng mới trong hệ thống',
      },
      {
        name: 'Xem danh sách người dùng',
        apiPath: '/api/v1/users',
        method: 'GET',
        module: 'users',
        description: 'Xem danh sách tất cả người dùng có phân trang',
      },
      {
        name: 'Xem chi tiết người dùng',
        apiPath: '/api/v1/users/:id',
        method: 'GET',
        module: 'users',
        description: 'Xem thông tin chi tiết của một người dùng theo ID',
      },
      {
        name: 'Cập nhật người dùng',
        apiPath: '/api/v1/users/:id',
        method: 'PATCH',
        module: 'users',
        description: 'Chỉnh sửa thông tin người dùng (tên, email, role...)',
      },
      {
        name: 'Xóa người dùng',
        apiPath: '/api/v1/users/:id',
        method: 'DELETE',
        module: 'users',
        description: 'Xóa tài khoản người dùng (chỉ Admin)',
      },
      {
        name: 'Đổi mật khẩu',
        apiPath: '/api/v1/users/password/update',
        method: 'PATCH',
        module: 'users',
        description: 'Người dùng tự đổi mật khẩu của mình',
      },
      {
        name: 'Reset mật khẩu',
        apiPath: '/api/v1/users/password/reset',
        method: 'PATCH',
        module: 'users',
        description: 'Admin đặt lại mật khẩu cho người dùng khác',
      },

      // Role module
      {
        name: 'Tạo vai trò',
        apiPath: '/api/v1/roles',
        method: 'POST',
        module: 'roles',
        description: 'Tạo vai trò mới với danh sách quyền tương ứng',
      },
      {
        name: 'Xem danh sách vai trò',
        apiPath: '/api/v1/roles',
        method: 'GET',
        module: 'roles',
        description: 'Xem danh sách tất cả vai trò có phân trang',
      },
      {
        name: 'Xem chi tiết vai trò',
        apiPath: '/api/v1/roles/:id',
        method: 'GET',
        module: 'roles',
        description: 'Xem thông tin chi tiết của một vai trò theo ID',
      },
      {
        name: 'Cập nhật vai trò',
        apiPath: '/api/v1/roles/:id',
        method: 'PATCH',
        module: 'roles',
        description: 'Chỉnh sửa tên, mô tả hoặc quyền của vai trò',
      },
      {
        name: 'Xóa vai trò',
        apiPath: '/api/v1/roles/:id',
        method: 'DELETE',
        module: 'roles',
        description: 'Xóa vai trò khỏi hệ thống (chỉ Admin)',
      },

      // Permission module
      {
        name: 'Tạo quyền',
        apiPath: '/api/v1/permissions',
        method: 'POST',
        module: 'permissions',
        description: 'Tạo quyền truy cập mới cho hệ thống',
      },
      {
        name: 'Xem danh sách quyền',
        apiPath: '/api/v1/permissions',
        method: 'GET',
        module: 'permissions',
        description: 'Xem danh sách tất cả quyền có phân trang',
      },
      {
        name: 'Xem chi tiết quyền',
        apiPath: '/api/v1/permissions/:id',
        method: 'GET',
        module: 'permissions',
        description: 'Xem thông tin chi tiết của một quyền theo ID',
      },
      {
        name: 'Cập nhật quyền',
        apiPath: '/api/v1/permissions/:id',
        method: 'PATCH',
        module: 'permissions',
        description: 'Chỉnh sửa thông tin quyền truy cập',
      },
      {
        name: 'Xóa quyền',
        apiPath: '/api/v1/permissions/:id',
        method: 'DELETE',
        module: 'permissions',
        description: 'Xóa quyền truy cập khỏi hệ thống (chỉ Admin)',
      },

      // Warehouse module
      {
        name: 'Tạo kho hàng',
        apiPath: '/api/v1/warehouses',
        method: 'POST',
        module: 'warehouses',
        description: 'Tạo mặt hàng mới trong kho',
      },
      {
        name: 'Xem danh sách kho hàng',
        apiPath: '/api/v1/warehouses',
        method: 'GET',
        module: 'warehouses',
        description: 'Xem danh sách tất cả mặt hàng trong kho có phân trang',
      },
      {
        name: 'Xem chi tiết kho hàng',
        apiPath: '/api/v1/warehouses/:id',
        method: 'GET',
        module: 'warehouses',
        description: 'Xem thông tin chi tiết của mặt hàng trong kho theo ID',
      },
      {
        name: 'Cập nhật kho hàng',
        apiPath: '/api/v1/warehouses/:id',
        method: 'PATCH',
        module: 'warehouses',
        description: 'Chỉnh sửa thông tin mặt hàng trong kho (chỉ Admin)',
      },
      {
        name: 'Xóa kho hàng',
        apiPath: '/api/v1/warehouses/:id',
        method: 'DELETE',
        module: 'warehouses',
        description: 'Xóa mặt hàng khỏi kho (chỉ Admin)',
      },
      {
        name: 'Nhập thêm hàng vào kho',
        apiPath: '/api/v1/warehouses/add-stock',
        method: 'POST',
        module: 'warehouses',
        description: 'Bổ sung số lượng hàng cho mặt hàng đã có trong kho',
      },

      // Order module
      {
        name: 'Tạo đơn hàng',
        apiPath: '/api/v1/orders',
        method: 'POST',
        module: 'orders',
        description: 'Tạo đơn hàng mới (trạng thái mặc định: Báo giá)',
      },
      {
        name: 'Xem danh sách đơn hàng',
        apiPath: '/api/v1/orders',
        method: 'GET',
        module: 'orders',
        description: 'Xem danh sách tất cả đơn hàng có phân trang',
      },
      {
        name: 'Xem chi tiết đơn hàng',
        apiPath: '/api/v1/orders/:id',
        method: 'GET',
        module: 'orders',
        description: 'Xem thông tin chi tiết của đơn hàng theo ID',
      },
      {
        name: 'Cập nhật đơn hàng',
        apiPath: '/api/v1/orders/:id',
        method: 'PATCH',
        module: 'orders',
        description: 'Chỉnh sửa thông tin đơn hàng (sản phẩm, ghi chú...)',
      },
      {
        name: 'Xóa đơn hàng',
        apiPath: '/api/v1/orders/:id',
        method: 'DELETE',
        module: 'orders',
        description: 'Xóa đơn hàng khỏi hệ thống (chỉ Admin)',
      },
      {
        name: 'Thêm lịch sử thanh toán',
        apiPath: '/api/v1/orders/:id/history',
        method: 'POST',
        module: 'orders',
        description: 'Ghi nhận khách trả tiền hoặc hoàn tiền cho đơn hàng',
      },
      {
        name: 'Chốt đơn hàng',
        apiPath: '/api/v1/orders/:id/confirm',
        method: 'PATCH',
        module: 'orders',
        description: 'Chuyển đơn hàng sang trạng thái Đã chốt',
      },
      {
        name: 'Hoàn tác đơn hàng',
        apiPath: '/api/v1/orders/:id/revert',
        method: 'PATCH',
        module: 'orders',
        description: 'Hoàn tác đơn hàng, trả lại hàng vào kho',
      },
      {
        name: 'Giao đơn hàng',
        apiPath: '/api/v1/orders/:id/deliver',
        method: 'PATCH',
        module: 'orders',
        description:
          'Chuyển đơn hàng sang trạng thái Đã giao (yêu cầu thanh toán đủ)',
      },

      // Customer module
      {
        name: 'Tạo khách hàng',
        apiPath: '/api/v1/customers',
        method: 'POST',
        module: 'customers',
        description: 'Thêm khách hàng mới vào hệ thống',
      },
      {
        name: 'Xem danh sách khách hàng',
        apiPath: '/api/v1/customers',
        method: 'GET',
        module: 'customers',
        description: 'Xem danh sách tất cả khách hàng có phân trang',
      },
      {
        name: 'Xem chi tiết khách hàng',
        apiPath: '/api/v1/customers/:id',
        method: 'GET',
        module: 'customers',
        description: 'Xem thông tin chi tiết của khách hàng theo ID',
      },
      {
        name: 'Cập nhật khách hàng',
        apiPath: '/api/v1/customers/:id',
        method: 'PATCH',
        module: 'customers',
        description: 'Chỉnh sửa thông tin khách hàng (tên, ghi chú...)',
      },
      {
        name: 'Xóa khách hàng',
        apiPath: '/api/v1/customers/:id',
        method: 'DELETE',
        module: 'customers',
        description: 'Xóa khách hàng khỏi hệ thống (chỉ Admin)',
      },

      // History Warehouse module - Nhập kho
      {
        name: 'Tạo lịch sử nhập kho',
        apiPath: '/api/v1/history-warehouse/enter',
        method: 'POST',
        module: 'history-warehouse',
        description: 'Tạo bản ghi lịch sử nhập kho mới (chỉ Admin)',
      },
      {
        name: 'Xem danh sách lịch sử nhập kho',
        apiPath: '/api/v1/history-warehouse/enter',
        method: 'GET',
        module: 'history-warehouse',
        description: 'Xem danh sách tất cả lịch sử nhập kho có phân trang',
      },
      {
        name: 'Xem chi tiết lịch sử nhập kho',
        apiPath: '/api/v1/history-warehouse/enter/:id',
        method: 'GET',
        module: 'history-warehouse',
        description: 'Xem thông tin chi tiết của lịch sử nhập kho theo ID',
      },
      {
        name: 'Cập nhật lịch sử nhập kho',
        apiPath: '/api/v1/history-warehouse/enter/:id',
        method: 'PATCH',
        module: 'history-warehouse',
        description: 'Chỉnh sửa thông tin lịch sử nhập kho (chỉ Admin)',
      },
      {
        name: 'Xóa lịch sử nhập kho',
        apiPath: '/api/v1/history-warehouse/enter/:id',
        method: 'DELETE',
        module: 'history-warehouse',
        description: 'Xóa bản ghi lịch sử nhập kho (chỉ Admin)',
      },

      // History Warehouse module - Xuất kho
      {
        name: 'Tạo lịch sử xuất kho',
        apiPath: '/api/v1/history-warehouse/export',
        method: 'POST',
        module: 'history-warehouse',
        description: 'Tạo bản ghi lịch sử xuất kho mới (chỉ Admin)',
      },
      {
        name: 'Xem danh sách lịch sử xuất kho',
        apiPath: '/api/v1/history-warehouse/export',
        method: 'GET',
        module: 'history-warehouse',
        description: 'Xem danh sách tất cả lịch sử xuất kho có phân trang',
      },
      {
        name: 'Xem chi tiết lịch sử xuất kho',
        apiPath: '/api/v1/history-warehouse/export/:id',
        method: 'GET',
        module: 'history-warehouse',
        description: 'Xem thông tin chi tiết của lịch sử xuất kho theo ID',
      },
      {
        name: 'Cập nhật lịch sử xuất kho',
        apiPath: '/api/v1/history-warehouse/export/:id',
        method: 'PATCH',
        module: 'history-warehouse',
        description: 'Chỉnh sửa thông tin lịch sử xuất kho (chỉ Admin)',
      },
      {
        name: 'Xóa lịch sử xuất kho',
        apiPath: '/api/v1/history-warehouse/export/:id',
        method: 'DELETE',
        module: 'history-warehouse',
        description: 'Xóa bản ghi lịch sử xuất kho (chỉ Admin)',
      },

      // Dashboard module
      {
        name: 'Báo cáo đơn hàng',
        apiPath: '/api/v1/dashboard/orders',
        method: 'GET',
        module: 'dashboard',
        description: 'Xem báo cáo tổng hợp đơn hàng theo kỳ (ngày/tháng/năm)',
      },
      {
        name: 'Báo cáo khách hàng',
        apiPath: '/api/v1/dashboard/customers',
        method: 'GET',
        module: 'dashboard',
        description: 'Xem báo cáo tổng hợp theo từng khách hàng trong kỳ',
      },
      {
        name: 'Báo cáo nhân viên',
        apiPath: '/api/v1/dashboard/staff',
        method: 'GET',
        module: 'dashboard',
        description:
          'Xem báo cáo tổng hợp theo từng nhân viên bán hàng trong kỳ',
      },
    ];

    return this.permissionModel.insertMany(
      initPermissions.map((p) => ({
        ...p,
        isActive: true,
        isDeleted: false,
      })),
    );
  }

  private async createRoles(permissions: any[]) {
    const allPermissionIds = permissions.map((p) => p._id);

    const userPermissionNames = [
      // Auth
      'Đăng xuất',
      'Xem thông tin tài khoản',
      // User (chỉ xem + đổi mật khẩu)
      'Xem danh sách người dùng',
      'Xem chi tiết người dùng',
      'Đổi mật khẩu',
      // Warehouse (tạo, xem, sửa, nhập hàng)
      'Tạo kho hàng',
      'Xem danh sách kho hàng',
      'Xem chi tiết kho hàng',
      'Cập nhật kho hàng',
      'Nhập thêm hàng vào kho',
      // Order (tạo, xem, sửa, thanh toán, chốt, giao)
      'Tạo đơn hàng',
      'Xem danh sách đơn hàng',
      'Xem chi tiết đơn hàng',
      'Cập nhật đơn hàng',
      'Thêm lịch sử thanh toán',
      'Chốt đơn hàng',
      'Giao đơn hàng',
      // Customer (tạo, xem, sửa)
      'Tạo khách hàng',
      'Xem danh sách khách hàng',
      'Xem chi tiết khách hàng',
      'Cập nhật khách hàng',
      // History Warehouse (chỉ xem)
      'Xem danh sách lịch sử nhập kho',
      'Xem chi tiết lịch sử nhập kho',
      'Xem danh sách lịch sử xuất kho',
      'Xem chi tiết lịch sử xuất kho',
      // Dashboard (xem báo cáo)
      'Báo cáo đơn hàng',
      'Báo cáo khách hàng',
      'Báo cáo nhân viên',
    ];
    const userPermissionIds = permissions
      .filter((p) => userPermissionNames.includes(p.name))
      .map((p) => p._id);

    const adminRole = await this.roleModel.create({
      name: 'admin',
      description: 'Toàn quyền truy cập tất cả chức năng trong hệ thống',
      permissions: allPermissionIds,
      isActive: true,
      isDeleted: false,
    });

    const userRole = await this.roleModel.create({
      name: 'user',
      description:
        'Nhân viên bán hàng: quản lý đơn hàng, khách hàng, kho hàng và xem báo cáo',
      permissions: userPermissionIds,
      isActive: true,
      isDeleted: false,
    });

    return { adminRole, userRole };
  }

  private async createUsers(adminRoleId: any, userRoleId: any) {
    const salt = genSaltSync(10);

    await this.userModel.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashSync('123456', salt),
      role: adminRoleId,
      isActive: true,
      isDeleted: false,
    });

    await this.userModel.create({
      name: 'User',
      email: 'user@example.com',
      password: hashSync('123456', salt),
      role: userRoleId,
      isActive: true,
      isDeleted: false,
    });
  }
}
