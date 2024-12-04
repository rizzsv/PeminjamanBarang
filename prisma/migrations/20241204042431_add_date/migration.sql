/*
  Warnings:

  - You are about to drop the column `jam` on the `peminjaman` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal` on the `peminjaman` table. All the data in the column will be lost.
  - Added the required column `borrow_date` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `return_date` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `peminjaman` DROP COLUMN `jam`,
    DROP COLUMN `tanggal`,
    ADD COLUMN `borrow_date` DATETIME(3) NOT NULL,
    ADD COLUMN `return_date` DATETIME(3) NOT NULL;
