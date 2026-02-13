import { SetMetadata } from '@nestjs/common';

export const IS_ALLOW_ALL_AUTHENTICATED_KEY = 'isAllowAllAuthenticated';
export const AllowAllAuthenticated = () =>
  SetMetadata(IS_ALLOW_ALL_AUTHENTICATED_KEY, true);
