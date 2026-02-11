import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { JwtAuthGuard } from './presentation/auth/guards/jwt-auth.guard.js';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  // Cookie parser
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global guards (JWT Auth + Permission check)
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // Global interceptors (Response transform)
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  // Static assets + views
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Quan Ly Kho BE')
    .setDescription('API for Quan Ly Kho - Warehouse Management System')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .addSecurityRequirements('token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Swagger JSON endpoint
  app
    .getHttpAdapter()
    .get(
      '/swagger-json',
      (req: unknown, res: { json: (body: unknown) => void }) => {
        res.json(document);
      },
    );

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  logger.log(`Server is running http://localhost:${port}/swagger`);
  logger.log(`Server is running http://localhost:${port}/swagger-json`);
}

bootstrap();
