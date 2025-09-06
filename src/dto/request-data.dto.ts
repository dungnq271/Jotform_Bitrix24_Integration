export class EmailValue {
  VALUE: string;
  VALUE_TYPE: string;
}

export class PhoneValue {
  VALUE: string;
  VALUE_TYPE: string;
}

export class Field {
  NAME: string;
  PHONE: PhoneValue[];
  EMAIL: EmailValue[];
}

export class RequestData {
  fields: Field;
}
