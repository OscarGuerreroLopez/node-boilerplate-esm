import { removeKeys } from '@/shared/helpers/remove-keys';

describe('removeKeys', () => {
  it('should remove undefined values', () => {
    const input = {
      name: 'John',
      email: undefined,
      age: 30,
    };

    const result = removeKeys(input);

    expect(result).toEqual({
      name: 'John',
      age: 30,
    });
  });

  it('should exclude specified keys', () => {
    const input = {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      status: 'ACTIVE',
    };

    const result = removeKeys(input, ['id', 'status']);

    expect(result).toEqual({
      name: 'John',
      email: 'john@example.com',
    });
  });

  it('should handle empty input objects', () => {
    const input = {};

    const result = removeKeys(input, ['id', 'email']);

    expect(result).toEqual({});
  });

  it('should handle objects with only excluded keys', () => {
    const input = {
      id: 1,
      email: 'john@example.com',
    };

    const result = removeKeys(input, ['id', 'email']);

    expect(result).toEqual({});
  });

  it('should handle objects with no undefined values or excluded keys', () => {
    const input = {
      name: 'John',
      age: 30,
      status: 'ACTIVE',
    };

    const result = removeKeys(input);

    expect(result).toEqual(input); // No changes expected
  });

  it('should not modify deeply nested objects (shallow removal)', () => {
    const input = {
      id: 1,
      details: {
        email: undefined,
        address: '123 Street',
      },
      status: 'ACTIVE',
    };

    const result = removeKeys(input, ['id']);

    expect(result).toEqual({
      details: {
        email: undefined,
        address: '123 Street',
      },
      status: 'ACTIVE',
    });
  });
});
