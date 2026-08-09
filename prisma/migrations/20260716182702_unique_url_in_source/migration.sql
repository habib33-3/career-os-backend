/*
  Warnings:

  - A unique constraint covering the columns `[userId,url]` on the table `Source` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Source_userId_url_key" ON "Source"("userId", "url");
