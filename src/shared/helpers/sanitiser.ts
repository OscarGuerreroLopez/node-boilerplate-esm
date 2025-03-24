import { type SanitiseBody, type IObjectLiteral } from '@/core/types/common';
import { maskEmail } from './mask-email';

export const sanitiser: SanitiseBody = (unsanitisedBody: IObjectLiteral): IObjectLiteral => {
  try {
    const sanitizeObject = (obj: IObjectLiteral): IObjectLiteral => {
      const sanitizedObj: IObjectLiteral = {};

      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
          sanitizedObj[key] = sanitizeObject(value as IObjectLiteral);
        } else {
          if (key.toLowerCase() === 'password') {
            sanitizedObj[key] = '********';
          } else if (key.toLowerCase() === 'email') {
            sanitizedObj[key] = maskEmail(value as string);
          } else if (key.toLowerCase() === 'lname') {
            sanitizedObj[key] = '********';
          } else if (/key/i.test(key)) {
            sanitizedObj[key] = '********';
          } else {
            sanitizedObj[key] = value;
          }
        }
      }

      return sanitizedObj;
    };

    return sanitizeObject(unsanitisedBody);
  } catch (error) {
    throw new Error(`sanitaser error ${error instanceof Error ? error.message : JSON.stringify(error)}`);
  }
};
