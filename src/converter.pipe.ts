import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  RequestDataDto,
  Field,
  PhoneValue,
  EmailValue,
} from './dto/request-data.dto';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { concat } from 'rxjs';
import { constants } from 'buffer';

@Injectable()
export class RequestDataConverterPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    let object = JSON.parse(value.rawRequest);

    const resultObject = {
      fields: {
        NAME: object.q3_name.first,
        LAST_NAME: object.q3_name.last,
        EMAIL: [
          {
            VALUE: object.q4_email,
            VALUE_TYPE: 'MAILING',
          },
        ],
        PHONE: [
          {
            VALUE: object.phoneNumber,
            VALUE_TYPE: 'HOME',
          },
        ],
      },
    };

    const result = plainToInstance(metatype, resultObject);
    console.log(result);

    return result;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

export class CustomValidationPipe extends ValidationPipe {
  private readonly logger = new Logger(CustomValidationPipe.name, {
    timestamp: true,
  });

  constructor() {
    super({
      exceptionFactory: (errors: ValidationError[]) => {
        let errorMessage = '';

        if (errors[0].children == undefined) {
          throw 'An error happend!';
        }

        for (let error of errors[0].children) {
          if (error.constraints == undefined) {
            console.log(error.constraints);
            continue;
          }

          errorMessage = errorMessage.concat(
            ...Object.values(error.constraints).map((s) => s + '. '),
          );
        }

        this.logger.error(errorMessage);
        throw new BadRequestException(errorMessage);
      },
    });
  }
}
