import { IsAlpha, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class EmailValue {
  VALUE: string;
  VALUE_TYPE: string;
}

export class PhoneValue {
  VALUE: string;
  VALUE_TYPE: string;
}

export class Field {
  @IsNotEmpty({
    message: 'First name must not be empty',
  })
  @IsAlpha('en-US', {
    message: 'First name must contain only letters (a-zA-Z)',
  })
  NAME: string;

  @IsAlpha('en-US', {
    message: 'Last name must contain only letters (a-zA-Z)',
  })
  LAST_NAME: string;

  @ValidateNested()
  @Type(() => PhoneValue)
  PHONE: PhoneValue[];

  @ValidateNested()
  @Type(() => EmailValue)
  EMAIL: EmailValue[];
}

export class RequestDataDto {
  @ValidateNested()
  @Type(() => Field)
  fields: Field;
}
