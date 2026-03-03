import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './presentation/auth/auth.module.js';
import { CustomerModule } from './presentation/customer/customer.module.js';
import { OrderModule } from './presentation/order/order.module.js';
import { PermissionModule } from './presentation/permission/permission.module.js';
import { RoleModule } from './presentation/role/role.module.js';
import { UserModule } from './presentation/user/user.module.js';
import { WarehouseModule } from './presentation/warehouse/warehouse.module.js';
import { DashboardModule } from './presentation/dashboard/dashboard.module.js';
import { HistoryWarehouseModule } from './presentation/history-warehouse/history-warehouse.module.js';
import { DatabaseModule } from './shared/database/database.module.js';
import { InchModule } from './presentation/inch/inch.module.js';
import { ItemModule } from './presentation/item/item.module.js';
import { QualityModule } from './presentation/quality/quality.module.js';
import { StyleModule } from './presentation/style/style.module.js';
import { ColorModule } from './presentation/color/color.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    CustomerModule,
    InchModule,
    ItemModule,
    QualityModule,
    StyleModule,
    ColorModule,
    WarehouseModule,
    OrderModule,
    HistoryWarehouseModule,
    DashboardModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
