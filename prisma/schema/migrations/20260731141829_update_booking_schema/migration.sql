/*
  Warnings:

  - You are about to drop the column `note` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issue` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workDuration` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_bookingId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "note",
DROP COLUMN "serviceId",
DROP COLUMN "totalPrice",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "issue" TEXT NOT NULL,
ADD COLUMN     "workDuration" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "provider";

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
