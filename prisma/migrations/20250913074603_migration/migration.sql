-- DropForeignKey
ALTER TABLE "public"."Restaurant" DROP CONSTRAINT "Restaurant_cuisineId_fkey";

-- AlterTable
ALTER TABLE "public"."Restaurant" ALTER COLUMN "cuisineId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Restaurant" ADD CONSTRAINT "Restaurant_cuisineId_fkey" FOREIGN KEY ("cuisineId") REFERENCES "public"."Cuisine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
