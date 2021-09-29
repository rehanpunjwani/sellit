-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "TireBrand" AS ENUM ('BRIDGESTONE', 'MICHELIN', 'DUNLOP', 'SERVICE', 'YOKOHAMA');

-- CreateEnum
CREATE TYPE "TireSize" AS ENUM ('ONESEVENFIVE_SEVENTY', 'ONEEIGHTFIVE_EIGHTYFIVE');

-- CreateEnum
CREATE TYPE "TirePattern" AS ENUM ('CAMBER', 'CUP');

-- CreateEnum
CREATE TYPE "TireMade" AS ENUM ('PAKISTAN', 'JAPAN', 'INDONESIA');

-- CreateEnum
CREATE TYPE "VendorType" AS ENUM ('LOCAL', 'IMPORT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "role" "Role" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "authorId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TireItemFile" (
    "id" TEXT NOT NULL,
    "brand" "TireBrand" NOT NULL,
    "size" "TireSize" NOT NULL,
    "pattern" "TirePattern" NOT NULL,
    "made" "TireMade" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseBill" (
    "id" TEXT NOT NULL,
    "totalCost" INTEGER NOT NULL,
    "advancePaid" INTEGER,
    "tireQuantity" INTEGER NOT NULL,
    "costPaid" INTEGER NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "nextPaymentDate" TIMESTAMP(3),
    "nextPaymentAmount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" VARCHAR(100),
    "type" "VendorType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TireInventory" (
    "id" TEXT NOT NULL,
    "itemFileId" TEXT NOT NULL,
    "dateOfManufacture" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sellingPrice" INTEGER NOT NULL,
    "averageSellingPrice" INTEGER NOT NULL,
    "purchasePrice" INTEGER NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "brand_size_pattern_made" ON "TireItemFile"("brand", "size", "pattern", "made");

-- CreateIndex
CREATE UNIQUE INDEX "itemFile_dateOfManufacture" ON "TireInventory"("itemFileId", "dateOfManufacture");

-- AddForeignKey
ALTER TABLE "Post" ADD FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseBill" ADD FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TireInventory" ADD FOREIGN KEY ("itemFileId") REFERENCES "TireItemFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TireInventory" ADD FOREIGN KEY ("purchaseId") REFERENCES "PurchaseBill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
