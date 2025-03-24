export const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  const maskedUsername = username.slice(0, 2) + '*'.repeat(username.length - 2);
  const domainParts = domain.split('.');
  const maskedDomain =
    domainParts.length > 1
      ? domainParts
          .slice(0, -1)
          .map(() => '*')
          .join('.') +
        '.' +
        domainParts[domainParts.length - 1]
      : domain;
  return `${maskedUsername}@${maskedDomain}`;
};
