import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator.js';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }

    // Check if @Public route => skip permission check
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return user;

    // If role is admin => allow all
    if (user.role && user.role.name === 'admin') {
      return user;
    }

    // Check permission: compare request path + method with user permissions
    const request = context.switchToHttp().getRequest<Request>();
    const requestPath = request.route?.path || request.path;
    const requestMethod = request.method;

    const permissions = user.permissions || [];
    const hasPermission = permissions.some(
      (perm: any) =>
        perm.apiPath === requestPath && perm.method === requestMethod,
    );

    if (!hasPermission) {
      throw new ForbiddenException('Bạn không có quyền truy cập endpoint này');
    }

    return user;
  }
}
