import { EnvConfig } from '../interfaces';

export const envConfig: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  NODE_PORT: Number(process.env.NODE_PORT) || 3000,
  DATABASE_URL: process.env.DATABASE_URL || '',
  REDIS_URL: process.env.REDIS_URL || '',
};
