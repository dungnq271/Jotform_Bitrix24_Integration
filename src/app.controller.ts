import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { UseInterceptors } from '@nestjs/common';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { BodyConverterPipe } from './converter.pipe';
import { SubmissionDto } from './dto/submission-body.dto';
import { RequestDataConverterPipe } from './converter.pipe';
import { RequestData } from './dto/request-data.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('webhook')
  @UseInterceptors(NoFilesInterceptor())
  async postSubmissions(
    @Body(
      new BodyConverterPipe(),
      new ValidationPipe(),
      new RequestDataConverterPipe(),
    )
    formData: RequestData,
  ) {
    await this.appService.postSubmission(formData);
  }
}
