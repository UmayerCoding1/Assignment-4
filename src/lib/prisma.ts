import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import config from '../config';

// Create pg connection pool
const pool = new Pool({
  connectionString: config.database_url,
});

// Create Prisma PostgreSQL adapter
const adapter = new PrismaPg(pool);

// Instantiate and export Prisma Client
export const prisma = new PrismaClient({
  adapter,
});
