/*
  Warnings:

  - You are about to drop the column `cuisine` on the `Restaurant` table. All the data in the column will be lost.
  - Added the required column `cuisineId` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Restaurant" DROP COLUMN "cuisine",
ADD COLUMN     "cuisineId" TEXT NOT NULL,
ALTER COLUMN "latitude" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "longitude" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "public"."Cuisine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "Cuisine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Restaurant" ADD CONSTRAINT "Restaurant_cuisineId_fkey" FOREIGN KEY ("cuisineId") REFERENCES "public"."Cuisine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
