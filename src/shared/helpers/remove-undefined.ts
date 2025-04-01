export const removeUndefinedDeep = <T>(obj: T): T => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj
      .map(removeUndefinedDeep) // Recursively process each element
      .filter((item) => item !== undefined && item !== '') as T; // Remove undefined elements
  }
  if (typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, value]) => value !== undefined && value !== '') // Remove undefined values
        .map(([key, value]) => [key, removeUndefinedDeep(value)]), // Recursively process nested objects
    ) as T;
  }
  return obj;
};
