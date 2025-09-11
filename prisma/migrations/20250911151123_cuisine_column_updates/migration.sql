/*
  Warnings:

  - Changed the type of `cuisine` on the `Restaurant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Restaurant" DROP COLUMN "cuisine",
ADD COLUMN     "cuisine" JSONB NOT NULL;
