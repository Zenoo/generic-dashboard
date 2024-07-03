-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "oldValue" VARCHAR(255),
ALTER COLUMN "newValue" DROP NOT NULL;
