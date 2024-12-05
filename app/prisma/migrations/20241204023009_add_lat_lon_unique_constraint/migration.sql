/*
  Warnings:

  - A unique constraint covering the columns `[lat,lon]` on the table `Weather` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Weather_lat_lon_key" ON "Weather"("lat", "lon");
