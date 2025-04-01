import { removeUndefinedDeep } from '@/shared/helpers/remove-undefined';

describe('removeUndefinedDeep', () => {
  it('should remove undefined values', () => {
    const input = {
      name: 'John',
      email: undefined,
      age: 30,
    };

    const result = removeUndefinedDeep(input);

    expect(result).toEqual({
      name: 'John',
      age: 30,
    });
  });

  it('should remove empty string values', () => {
    const input = {
      name: 'John',
      email: '',
      age: 30,
    };

    const result = removeUndefinedDeep(input);

    expect(result).toEqual({
      name: 'John',
      age: 30,
    });
  });

  it('should remove undefined and empty string values from nested objects', () => {
    const input = {
      name: 'John',
      contact: {
        email: '',
        phone: undefined,
        address: [
          {
            street: '123 Main St',
            city: '',
          },
        ],
      },
      age: 30,
    };

    const result = removeUndefinedDeep(input);

    expect(result).toEqual({
      name: 'John',
      contact: {
        address: [
          {
            street: '123 Main St',
          },
        ],
      },
      age: 30,
    });
  });

  it('should remove undefined and empty string values from arrays', () => {
    const input = {
      tags: ['developer', '', undefined, 'engineer'],
    };

    const result = removeUndefinedDeep(input);

    expect(result).toEqual({
      tags: ['developer', 'engineer'],
    });
  });

  it('should return an empty object if all properties are removed', () => {
    const input = {
      email: '',
      phone: undefined,
      address: '',
    };

    const result = removeUndefinedDeep(input);

    expect(result).toEqual({});
  });

  it('should return an empty object if all properties are removed with empty array too', () => {
    const input = {
      email: '',
      phone: undefined,
      address: [],
    };

    const result = removeUndefinedDeep(input);

    expect(result).toEqual({});
  });

  it('should return an empty array if all elements are removed', () => {
    const input = {
      tags: ['', undefined, ''],
    };

    const result = removeUndefinedDeep(input);

    expect(result).toEqual({
      tags: [],
    });
  });

  it('should return the same object if there are no undefined or empty string values', () => {
    const input = {
      name: 'John',
      age: 30,
      contact: {
        email: 'john@example.com',
        phone: '123-456-7890',
      },
    };

    const result = removeUndefinedDeep(input);

    expect(result).toEqual(input); // No changes expected
  });
});
