import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator.js';

@ApiTags('App')
@Controller()
export class AppController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Check server status' })
  @ApiOkResponse({ description: 'Server is running' })
  getServerStatus() {
    return { message: 'Server is running' };
  }
}
