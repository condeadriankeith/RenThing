/*
  Warnings:

  - A unique constraint covering the columns `[userId,traitName]` on the table `PersonalityTrait` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PersonalityTrait_userId_traitName_key" ON "PersonalityTrait"("userId", "traitName");
