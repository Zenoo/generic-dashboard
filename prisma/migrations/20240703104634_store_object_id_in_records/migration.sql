/*
  Warnings:

  - Added the required column `objectId` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "objectId" VARCHAR(255) NOT NULL;
