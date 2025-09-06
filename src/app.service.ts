import { Injectable, Logger } from '@nestjs/common';
import { SubmissionDto } from './dto/submission-body.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { RequestData } from './dto/request-data.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(private readonly httpService: HttpService) {}

  /**
   * Get contact with email or phone similar to the current data request
   */
  async getContact(formData: RequestData) {
    const { data } = await firstValueFrom(
      this.httpService.post(
        'https://nguyendung.bitrix24.vn/rest/1/abqsdeuxzxdhvkc9/crm.contact.list',
        { filter: { EMAIL: formData.fields.EMAIL[0].VALUE } },
      ),
    );
    return data;
  }

  /**
   * Post form submission data to Bitrix24
   */
  async postSubmission(formData: RequestData) {
    const duplicate = await this.getContact(formData);
    if (duplicate.total === 0) {
      const { data } = await firstValueFrom(
        this.httpService
          .post(
            'https://nguyendung.bitrix24.vn/rest/1/abqsdeuxzxdhvkc9/crm.contact.add',
            formData,
          )
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
}
