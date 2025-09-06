import { IsAlpha, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';

class FullName {
  @IsNotEmpty({
    message: 'First name must not be empty',
  })
  @IsAlpha()
  first: string;
  @IsAlpha()
  last: string;
}

export class SubmissionDto {
  @ValidateNested()
  name: FullName;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  phoneNumber: string;
}
