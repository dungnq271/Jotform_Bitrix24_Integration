import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { SubmissionDto } from './dto/submission-body.dto';
import {
  RequestData,
  Field,
  PhoneValue,
  EmailValue,
} from './dto/request-data.dto';

@Injectable()
export class BodyConverterPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    const result = new SubmissionDto();
    let object = JSON.parse(value.rawRequest);
    console.log(object);
    result.name = object.q3_name;
    result.email = object.q4_email;
    result.phoneNumber = object.q5_phoneNumber.full;
    return result;
  }
}

@Injectable()
export class RequestDataConverterPipe implements PipeTransform<any> {
  async transform(value: SubmissionDto, { metatype }: ArgumentMetadata) {
    console.log(value);
    const result = new RequestData();
    result.fields = new Field();
    result.fields.NAME = `${value.name.first}${value.name.last !== '' ? ' ' + value.name.last : ''}`;
    result.fields.EMAIL = [new EmailValue()];
    result.fields.EMAIL[0].VALUE = value.email;
    result.fields.EMAIL[0].VALUE_TYPE = 'MAILING';
    result.fields.PHONE = [new PhoneValue()];
    result.fields.PHONE[0].VALUE = value.phoneNumber;
    result.fields.PHONE[0].VALUE_TYPE = 'HOME';
    return result;
  }
}
