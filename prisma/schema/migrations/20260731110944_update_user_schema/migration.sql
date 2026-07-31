-- AlterTable
ALTER TABLE "TechnicianProfile" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "skills" TEXT[];

-- AddForeignKey
ALTER TABLE "TechnicianProfile" ADD CONSTRAINT "TechnicianProfile_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
