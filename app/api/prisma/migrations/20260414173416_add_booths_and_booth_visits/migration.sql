-- CreateTable
CREATE TABLE "Booth" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "qrCodeSlug" TEXT NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "Booth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoothVisit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "boothId" TEXT NOT NULL,

    CONSTRAINT "BoothVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booth_qrCodeSlug_key" ON "Booth"("qrCodeSlug");

-- CreateIndex
CREATE UNIQUE INDEX "BoothVisit_userId_boothId_key" ON "BoothVisit"("userId", "boothId");

-- AddForeignKey
ALTER TABLE "Booth" ADD CONSTRAINT "Booth_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoothVisit" ADD CONSTRAINT "BoothVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoothVisit" ADD CONSTRAINT "BoothVisit_boothId_fkey" FOREIGN KEY ("boothId") REFERENCES "Booth"("id") ON DELETE CASCADE ON UPDATE CASCADE;
