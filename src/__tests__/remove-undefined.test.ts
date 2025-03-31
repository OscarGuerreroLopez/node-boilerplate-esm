import { removeUndefinedDeep } from '@/shared/helpers/remove-undefined';

describe('removeUndefinedDeep', () => {
  it('should remove undefined values from an object', () => {
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

  it('should handle nested objects', () => {
    const input = {
      id: 1,
      details: {
        email: undefined,
        address: {
          street: '123 Street',
          city: undefined,
        },
      },
      status: 'ACTIVE',
    };

    const result = removeUndefinedDeep(input);

    expect(result).toEqual({
      id: 1,
      details: {
        address: {
          street: '123 Street',
        },
      },
      status: 'ACTIVE',
    });
  });

  it('should handle arrays and remove undefined values', () => {
    const input = [{ name: 'John', email: undefined }, { name: 'Jane', email: 'jane@example.com' }, undefined];

    const result = removeUndefinedDeep(input);

    expect(result).toEqual([{ name: 'John' }, { name: 'Jane', email: 'jane@example.com' }]);
  });

  it('should handle deeply nested arrays', () => {
    const input = [
      {
        id: 1,
        tags: ['tag1', undefined, 'tag2'],
        details: [{ key: 'value', extra: undefined }, undefined],
      },
      undefined,
    ];

    const result = removeUndefinedDeep(input);

    expect(result).toEqual([
      {
        id: 1,
        tags: ['tag1', 'tag2'],
        details: [{ key: 'value' }],
      },
    ]);
  });

  it('should preserve falsy values like null, 0, and false', () => {
    const input = {
      name: 'John',
      email: null,
      isActive: false,
      score: 0,
      optionalField: undefined,
    };

    const result = removeUndefinedDeep(input);

    expect(result).toEqual({
      name: 'John',
      email: null,
      isActive: false,
      score: 0,
    });
  });

  it('should handle empty objects', () => {
    const input = {};

    const result = removeUndefinedDeep(input);

    expect(result).toEqual({});
  });

  it('should handle empty arrays', () => {
    const input: any[] = [];

    const result = removeUndefinedDeep(input);

    expect(result).toEqual([]);
  });

  it('should handle mixed structures of objects and arrays', () => {
    const input = {
      users: [
        { id: 1, name: 'John', email: undefined },
        { id: 2, name: 'Jane', email: 'jane@example.com' },
      ],
      settings: {
        theme: 'dark',
        notifications: undefined,
        features: {
          analytics: true,
          logging: undefined,
        },
      },
    };

    const result = removeUndefinedDeep(input);

    expect(result).toEqual({
      users: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane', email: 'jane@example.com' },
      ],
      settings: {
        theme: 'dark',
        features: {
          analytics: true,
        },
      },
    });
  });
});
