import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  app_url: process.env.APP_URL || 'http://localhost:5000',
  jwt: {
    secret: process.env.JWT_ACCESS_SECRET || 'secret',
    expires_in: process.env.JWT_EXPIRES_IN || '1d',
  },
  database_url: process.env.DATABASE_URL,
};

export default config;
