import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  API_PREFIX: get('DEFAULT_API_PREFIX').default('/api/v1').asString(),
  NODE_ENV: get('NODE_ENV').default('development').asString(),
  PLATFORM: get('PLATFORM').required().asString(),
  API_KEY: get('API_KEY').required().asString(),
  MONGO_USER: get('MONGO_USER').required().asString(),
  MONGO_PASSWORD: get('MONGO_PASSWORD').required().asString(),
  MONGO_URL: get('MONGO_URL').required().asString(),
  MONGO_DATABASE: get('MONGO_DATABASE').required().asString(),
  SERVICE_NAME: get('SERVICE_NAME').required().asString(),
};
