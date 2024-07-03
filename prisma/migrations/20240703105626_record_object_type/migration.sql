/*
  Warnings:

  - Changed the type of `object` on the `Record` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `objectId` on the `Record` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RecordObject" AS ENUM ('USER');

-- AlterTable
ALTER TABLE "Record" DROP COLUMN "object",
ADD COLUMN     "object" "RecordObject" NOT NULL,
DROP COLUMN "objectId",
ADD COLUMN     "objectId" UUID NOT NULL;
