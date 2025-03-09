import { PrimitiveValueObject } from 'micro-library-ai';

export class OptionalIdVo extends PrimitiveValueObject<string> {
  static create(value?: string): OptionalIdVo {
    if (value == null) {
      return new OptionalIdVo('');
    }

    return new OptionalIdVo(value);
  }
}
