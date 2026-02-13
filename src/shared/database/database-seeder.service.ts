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
      // User module
      {
        name: 'Create User',
        apiPath: '/api/v1/users',
        method: 'POST',
        module: 'users',
      },
      {
        name: 'Get Users',
        apiPath: '/api/v1/users',
        method: 'GET',
        module: 'users',
      },
      {
        name: 'Get User By Id',
        apiPath: '/api/v1/users/:id',
        method: 'GET',
        module: 'users',
      },
      {
        name: 'Update User',
        apiPath: '/api/v1/users/:id',
        method: 'PATCH',
        module: 'users',
      },
      {
        name: 'Delete User',
        apiPath: '/api/v1/users/:id',
        method: 'DELETE',
        module: 'users',
      },
      {
        name: 'Update Password',
        apiPath: '/api/v1/users/password/update',
        method: 'PATCH',
        module: 'users',
      },
      {
        name: 'Reset Password',
        apiPath: '/api/v1/users/password/reset',
        method: 'PATCH',
        module: 'users',
      },

      // Role module
      {
        name: 'Create Role',
        apiPath: '/api/v1/roles',
        method: 'POST',
        module: 'roles',
      },
      {
        name: 'Get Roles',
        apiPath: '/api/v1/roles',
        method: 'GET',
        module: 'roles',
      },
      {
        name: 'Get Role By Id',
        apiPath: '/api/v1/roles/:id',
        method: 'GET',
        module: 'roles',
      },
      {
        name: 'Update Role',
        apiPath: '/api/v1/roles/:id',
        method: 'PATCH',
        module: 'roles',
      },
      {
        name: 'Delete Role',
        apiPath: '/api/v1/roles/:id',
        method: 'DELETE',
        module: 'roles',
      },

      // Permission module
      {
        name: 'Create Permission',
        apiPath: '/api/v1/permissions',
        method: 'POST',
        module: 'permissions',
      },
      {
        name: 'Get Permissions',
        apiPath: '/api/v1/permissions',
        method: 'GET',
        module: 'permissions',
      },
      {
        name: 'Get Permission By Id',
        apiPath: '/api/v1/permissions/:id',
        method: 'GET',
        module: 'permissions',
      },
      {
        name: 'Update Permission',
        apiPath: '/api/v1/permissions/:id',
        method: 'PATCH',
        module: 'permissions',
      },
      {
        name: 'Delete Permission',
        apiPath: '/api/v1/permissions/:id',
        method: 'DELETE',
        module: 'permissions',
      },

      // Auth module
      {
        name: 'Logout',
        apiPath: '/api/v1/auth/logout',
        method: 'POST',
        module: 'auth',
      },
      {
        name: 'Get Account',
        apiPath: '/api/v1/auth/account',
        method: 'GET',
        module: 'auth',
      },

      // Warehouse module
      {
        name: 'Create Warehouse',
        apiPath: '/api/v1/warehouses',
        method: 'POST',
        module: 'warehouses',
      },
      {
        name: 'Get Warehouses',
        apiPath: '/api/v1/warehouses',
        method: 'GET',
        module: 'warehouses',
      },
      {
        name: 'Get Warehouse By Id',
        apiPath: '/api/v1/warehouses/:id',
        method: 'GET',
        module: 'warehouses',
      },
      {
        name: 'Update Warehouse',
        apiPath: '/api/v1/warehouses/:id',
        method: 'PATCH',
        module: 'warehouses',
      },
      {
        name: 'Delete Warehouse',
        apiPath: '/api/v1/warehouses/:id',
        method: 'DELETE',
        module: 'warehouses',
      },
      {
        name: 'Add Stock',
        apiPath: '/api/v1/warehouses/add-stock',
        method: 'POST',
        module: 'warehouses',
      },

      // Order module
      {
        name: 'Create Order',
        apiPath: '/api/v1/orders',
        method: 'POST',
        module: 'orders',
      },
      {
        name: 'Get Orders',
        apiPath: '/api/v1/orders',
        method: 'GET',
        module: 'orders',
      },
      {
        name: 'Get Order By Id',
        apiPath: '/api/v1/orders/:id',
        method: 'GET',
        module: 'orders',
      },
      {
        name: 'Update Order',
        apiPath: '/api/v1/orders/:id',
        method: 'PATCH',
        module: 'orders',
      },
      {
        name: 'Delete Order',
        apiPath: '/api/v1/orders/:id',
        method: 'DELETE',
        module: 'orders',
      },
      {
        name: 'Add History',
        apiPath: '/api/v1/orders/:id/history',
        method: 'POST',
        module: 'orders',
      },
      {
        name: 'Confirm Order',
        apiPath: '/api/v1/orders/:id/confirm',
        method: 'PATCH',
        module: 'orders',
      },
      {
        name: 'Revert Order',
        apiPath: '/api/v1/orders/:id/revert',
        method: 'PATCH',
        module: 'orders',
      },

      // Customer module
      {
        name: 'Create Customer',
        apiPath: '/api/v1/customers',
        method: 'POST',
        module: 'customers',
      },
      {
        name: 'Get Customers',
        apiPath: '/api/v1/customers',
        method: 'GET',
        module: 'customers',
      },
      {
        name: 'Get Customer By Id',
        apiPath: '/api/v1/customers/:id',
        method: 'GET',
        module: 'customers',
      },
      {
        name: 'Update Customer',
        apiPath: '/api/v1/customers/:id',
        method: 'PATCH',
        module: 'customers',
      },
      {
        name: 'Delete Customer',
        apiPath: '/api/v1/customers/:id',
        method: 'DELETE',
        module: 'customers',
      },
    ];

    return this.permissionModel.insertMany(
      initPermissions.map((p) => ({
        ...p,
        description: `Permission to ${p.name.toLowerCase()}`,
        isActive: true,
        isDeleted: false,
      })),
    );
  }

  private async createRoles(permissions: any[]) {
    const allPermissionIds = permissions.map((p) => p._id);

    // User permissions (basic operations for staff)
    const userPermissionNames = [
      // Auth module
      'Logout',
      'Get Account',
      // User module
      'Get Users',
      'Get User By Id',
      'Update Password',
      // Warehouse module
      'Create Warehouse',
      'Get Warehouses',
      'Get Warehouse By Id',
      'Update Warehouse',
      'Add Stock',
      // Order module
      'Create Order',
      'Get Orders',
      'Get Order By Id',
      'Update Order',
      'Add History',
      'Confirm Order',
      // Customer module
      'Create Customer',
      'Get Customers',
      'Get Customer By Id',
      'Update Customer',
    ];
    const userPermissionIds = permissions
      .filter((p) => userPermissionNames.includes(p.name))
      .map((p) => p._id);

    const adminRole = await this.roleModel.create({
      name: 'admin',
      description: 'Full access to all system features',
      permissions: allPermissionIds,
      isActive: true,
      isDeleted: false,
    });

    const userRole = await this.roleModel.create({
      name: 'user',
      description: 'Basic user access',
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
