export const removeKeys = <T>(data: Partial<T>, excludeKeys: string[] = []): Partial<T> => {
  return Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== undefined && !excludeKeys.includes(key))) as Partial<T>;
};
