import { isDeepStrictEqual } from "util";

export abstract class AbstractValueObject<T> {
  protected readonly _value: T;

  protected constructor(_value: T) {
    this._value = Object.freeze(_value);
  }

  equals(vo?: AbstractValueObject<T>): boolean {
    if (!vo) {
      return false;
    }
    return isDeepStrictEqual(this._value, vo._value);
  }
}
