import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { RequestDataDto } from './dto/request-data.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name, { timestamp: true });
  constructor(private readonly httpService: HttpService) {}

  /**
   * Get contact with email similar to the current data request
   */
  async isDuplicateEmailContact(formData: RequestDataDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(`${process.env.BITRIX24_WEBHOOK}crm.contact.list`, {
          filter: { EMAIL: formData.fields.EMAIL[0].VALUE },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw 'An error happend!';
          }),
        ),
    );
    return data.total > 0;
  }

  /**
   * Get contact with phone similar to the current data request
   */
  async isDuplicatePhoneContact(formData: RequestDataDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(`${process.env.BITRIX24_WEBHOOK}crm.contact.list`, {
          filter: { PHONE: formData.fields.PHONE[0].VALUE },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw 'An error happend!';
          }),
        ),
    );
    return data.total > 0;
  }

  /**
   * Post form submission data to Bitrix24
   */
  async postSubmission(formData: RequestDataDto) {
    // Only add contact if email and phone does not exist
    if (await this.isDuplicateEmailContact(formData)) {
      this.logger.error('Duplicate contact by email');
      throw new HttpException(
        'Duplicate contact by email',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (await this.isDuplicatePhoneContact(formData)) {
      this.logger.error('Duplicate contact by phone');
      throw new HttpException(
        'Duplicate contact by phone',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { data } = await firstValueFrom(
      this.httpService
        .post(`${process.env.BITRIX24_WEBHOOK}crm.contact.add`, formData)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw 'An error happend!';
          }),
        ),
    );
    return data;
  }
}
