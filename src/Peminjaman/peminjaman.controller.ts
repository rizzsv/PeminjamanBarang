import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "minimal" });

const CreateBorrow = async (req: Request, res: Response): Promise<any> => {
    try {
        const user_id: number = Number(req.body.user_id);
        const barang_id: number = Number(req.body.barang_id);
        const borrow_date: Date = new Date(req.body.borrow_date);
        const return_date = req.body.return_date ? new Date(req.body.return_date) : ""
        const deskripsi: string = req.body.deskripsi;

        // Validasi foreign key
        const userExists = await prisma.user.findUnique({
            where: { id: user_id },
        });
        if (!userExists) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        const barangExists = await prisma.barang.findUnique({
            where: { id: barang_id },
        });
        if (!barangExists) {
            return res.status(404).json({ message: "Barang tidak ditemukan" });
        }

        // Format tanggal
        const newBorrow = await prisma.peminjaman.create({
            data: {
                user_id,
                barang_id,
                borrow_date,
                return_date,
                deskripsi,
            },
        });

        return res.status(200).json({
            message: "Peminjaman berhasil dibuat",
            data: newBorrow,
        });
    } catch (error) {
        console.error("Error saat membuat peminjaman:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};

const CreateReturn = async (req: Request, res: Response): Promise<any> => {
    try {
        const peminjaman_id: number = Number(req.body.peminjaman_id);
        const return_date: Date = new Date(req.body.return_date); // Tanggal jatuh tempo pengembalian
        const actual_return_date: Date = new Date(); // Tanggal pengembalian aktual (saat ini)
        const notes: string = req.body.notes || "";  // Catatan pengembalian opsional

        // Validasi peminjaman yang ada
        const peminjamanExists = await prisma.peminjaman.findUnique({
            where: { id: peminjaman_id },
            include: {
                Barang: true, // Dapatkan informasi barang yang dipinjam
                user: true,   // Dapatkan informasi pengguna
            },
        });

        if (!peminjamanExists) {
            return res.status(404).json({ message: "Peminjaman tidak ditemukan" });
        }

        // Pastikan tanggal pengembalian valid dan ada
        if (!return_date || isNaN(return_date.getTime())) {
            return res.status(400).json({ message: "Tanggal pengembalian tidak valid" });
        }
        // Memperbarui peminjaman dengan tanggal pengembalian
        await prisma.peminjaman.update({
            where: { id: peminjaman_id },
            data: {
                return_date, // Update tanggal pengembalian
            },
        });

        // Mencatat pengembalian di tabel Pengembalian
        const newPengembalian = await prisma.pengembalian.create({
            data: {
                return_date, 
                actual_return_date, // Simpan actual return date
                notes, 
                Peminjaman: { connect: { id: peminjaman_id } }, 
                barang: { connect: { id: peminjamanExists.barang_id } }, 
                user: { connect: { id: peminjamanExists.user_id } }, 
            },
        });

        // Kembalikan respon sukses
        return res.status(200).json({
            message: "Pengembalian berhasil diproses",
            data: newPengembalian,
        });
    } catch (error) {
        console.error("Error saat memproses pengembalian:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};

const usageReport = async (req: Request, res: Response): Promise<any> => {
    try {
      const { start_date, end_date, group_by } = req.body;
  
      // Validasi input
      if (!start_date || !end_date || !group_by) {
        return res.status(400).json({
          status: "error",
          message: "start_date, end_date, dan group_by harus disediakan",
        });
      }
  
      // Query ke database
      const usageAnalysis = await prisma.peminjaman.groupBy({
        by: ["barang_id"],
        where: {
          borrow_date: {
            gte: new Date(start_date),
            lte: new Date(end_date),
          },
        },
        _count: {
          _all: true,
        },
        _sum: {
          user_id: true,
        },
      });
  
      // Response
      return res.status(200).json({
        status: "success",
        data: {
          analysis_period: {
            start_date,
            end_date,
          },
          usage_analysis: usageAnalysis.map((item) => ({
            group: item[group_by as keyof typeof item],
            total_borrowed: item._count?._all ?? 0,
            total_returned: item._sum?.user_id ?? 0,
            items_in_use: (item._count?._all ?? 0) - (item._sum?.user_id ?? 0),
          })),
        },
      });
    } catch (error: any) {
      console.error("Error:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  };

export { CreateBorrow, CreateReturn, usageReport };
