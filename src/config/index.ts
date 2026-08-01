import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });
console.log(process.env.APP_URL)
const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  app_url: process.env.APP_URL || 'http://localhost:3000',

  access_token_secret: process.env.ACCESS_TOKEN_SECRET || 'secret',
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET || 'secret',

  access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN || '1d',
  refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',

  database_url: process.env.DATABASE_URL,

  hash_salt: Number(process.env.HASH_SALT) || 12,

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    publicKey: process.env.STRIPE_PUBLIC_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },

  imagekit: {
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
  },

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};

export default config;
