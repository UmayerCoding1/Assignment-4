-- CreateEnum
CREATE TYPE "TechnicianStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'BUSY');

-- AlterTable
ALTER TABLE "TechnicianProfile" ADD COLUMN     "status" "TechnicianStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT;
