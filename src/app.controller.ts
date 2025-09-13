import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { AppService } from './app.service';
import { NoFilesInterceptor } from '@nestjs/platform-express';

import { RequestDataConverterPipe } from './converter.pipe';
import { RequestDataDto } from './dto/request-data.dto';
import { CustomValidationPipe } from './converter.pipe';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name, { timestamp: true });
  constructor(private readonly appService: AppService) {}

  @Post('webhook')
  @UseInterceptors(NoFilesInterceptor())
  async postSubmissions(
    @Body(new RequestDataConverterPipe(), new CustomValidationPipe())
    formData: RequestDataDto,
  ) {
    await this.appService.postSubmission(formData);
  }
}
