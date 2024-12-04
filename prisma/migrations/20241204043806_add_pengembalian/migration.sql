-- CreateTable
CREATE TABLE `Pengembalian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `barang_id` INTEGER NOT NULL,
    `peminjaman_id` INTEGER NOT NULL,
    `return_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pengembalian` ADD CONSTRAINT `Pengembalian_peminjaman_id_fkey` FOREIGN KEY (`peminjaman_id`) REFERENCES `Peminjaman`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengembalian` ADD CONSTRAINT `Pengembalian_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengembalian` ADD CONSTRAINT `Pengembalian_barang_id_fkey` FOREIGN KEY (`barang_id`) REFERENCES `Barang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
