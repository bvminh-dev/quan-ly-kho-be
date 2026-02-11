import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../infrastructure/mongo/user/user.schema.js';
import { Role, RoleSchema } from '../../infrastructure/mongo/role/role.schema.js';
import { Permission, PermissionSchema } from '../../infrastructure/mongo/permission/permission.schema.js';
import { DatabaseSeederService } from './database-seeder.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  providers: [DatabaseSeederService],
  exports: [DatabaseSeederService],
})
export class DatabaseModule {}
