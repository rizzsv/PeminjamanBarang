/*
  Warnings:

  - You are about to drop the column `kelas_id` on the `peminjaman` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `no_hp` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `peminjaman` DROP FOREIGN KEY `Peminjaman_kelas_id_fkey`;

-- AlterTable
ALTER TABLE `barang` ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `location` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `peminjaman` DROP COLUMN `kelas_id`,
    ADD COLUMN `barang_id` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `nama`,
    DROP COLUMN `no_hp`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `numberPhone` VARCHAR(191) NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_barang_id_fkey` FOREIGN KEY (`barang_id`) REFERENCES `Barang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
