-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('Apartment', 'House', 'Condo', 'Villa');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AVAILABLE', 'RENTED', 'RESERVED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TENANT', 'ADMIN', 'LANDLORD');

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "baseRentPrice" DOUBLE PRECISION NOT NULL,
    "beds" INTEGER,
    "baths" INTEGER,
    "area" DOUBLE PRECISION,
    "propertyType" "PropertyType" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'AVAILABLE',
    "locationAddress" TEXT,
    "coordinates" DOUBLE PRECISION[],
    "images" TEXT[],
    "nearTransitType" TEXT,
    "nearTransitDist" DOUBLE PRECISION,
    "parkingSpaces" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "yearBuilt" INTEGER,
    "petAllowed" BOOLEAN NOT NULL DEFAULT false,
    "appliances" TEXT[],
    "availableDate" TIMESTAMP(3),
    "internetName" TEXT,
    "internetSpeed" TEXT,
    "leaseTermMonths" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "role" "Role" NOT NULL DEFAULT 'TENANT',
    "profilePictures" TEXT NOT NULL,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifyOTP" TEXT,
    "verifyOTPExpiry" INTEGER NOT NULL DEFAULT 0,
    "verifyOTPGeneratedAt" INTEGER NOT NULL DEFAULT 0,
    "resetPasswordOTP" TEXT,
    "resetPasswordOTPExpiry" INTEGER NOT NULL DEFAULT 0,
    "resetPasswordOTPGeneratedAt" INTEGER NOT NULL DEFAULT 0,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
