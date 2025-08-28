import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('')
@Controller('/')
export class AppController {
  @Get()
  getRootResponse(): object {
    return {
      success: true,
      message: 'Welcome! The API is running correctly.',
      data: null,
    };
  }
}
