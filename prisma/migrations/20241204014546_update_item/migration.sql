/*
  Warnings:

  - You are about to drop the column `nama` on the `barang` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `barang` DROP COLUMN `nama`,
    ADD COLUMN `nameItem` VARCHAR(191) NOT NULL DEFAULT '';
