import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({errorFormat: "minimal"});

//create data barang
const CreateItem = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const nameItem : string = req.body.nameItem;
        const category : string = req.body.category;
        const location : string = req.body.location;
        const qty      : number = req.body.qty;

        const newItem = await prisma.barang.create({
            data: {
                nameItem,
                category,
                location,
                qty
            }
        });
        res.status(200).json({
            message: `Barang ${nameItem} berhasil ditambahkan`,
            data: newItem
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const ReadItem = async (
    req: Request, 
    res: Response
): Promise<any> => {
    try {
        const id = req.params.id;
        const allItem = await prisma.barang.findUnique({
            where: {
                id: Number(id)
            }
        })

        if(!allItem){
            return res.status(200).json({
                message: "Barang tidak ditemukan"
            })
        }
        return res.status(200).json({
            message: `Data barang berhasil ditemukan`,
            data: allItem
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

const UpdateItem = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const id = req.params.id;

        const findItem = await prisma.barang.findFirst({
            where: {id: Number(id)}
        })
        if(!findItem){
            return res.status(200).json({
                message: "Barang tidak ditemukan"
            })
        }
        
        const  {
            nameItem,
            category,
            location,
            qty
        } = req.body

        const saveItem = await prisma.barang.update({
            where: {id: Number(id)},
            data: {
                nameItem: nameItem ?? findItem.nameItem,
                category: category ?? findItem.category,
                location: location ?? findItem.location,
                qty: qty ?? findItem.qty
            }
        })
        return res.status(200).json({
            message: `Barang berhasil diupdate`,
            data: saveItem
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const DeleteItem = async (
    req: Request,
    res: Response,
): Promise<any> => {
    try {
        const id = req.params.id;
        const findItem = await prisma.barang.findFirst({
            where: {id: Number(id)}
        })
        if(!findItem){
            return res.status(200).json({
                message: "Barang tidak ditemukan"
            })
        }

        const deletedItem = await prisma.barang.delete({
            where: {id: Number(id)}
        });

        return res.status(200).json({
            message: `Barang berhasil dihapus`,
            data: deletedItem
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export {CreateItem, ReadItem, UpdateItem, DeleteItem}