import { Request, Response } from "express";
import {PrismaClient, UserRole} from "@prisma/client";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import Jwt  from "jsonwebtoken";

const prisma = new PrismaClient({errorFormat: "minimal"});

//create data user
const createUser = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const name : string = req.body.name;
        const password : string = req.body.password;
        const email : string = req.body.email;
        const numberPhone : string = req.body.numberPhone;
        const role : UserRole = req.body.role;
        const jurusan : string = req.body.jurusan;

        const findEmail = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if (findEmail){
            return res.status(400).json({
                message: "Email sudah terdaftar"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                name,
                password: hashPassword,
                email,
                numberPhone,
                role,
                jurusan
            }
        })
        return res.status(200).json({
            message: `User  berhasil dibuat`,
            data: newUser
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const readUser = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const search = req.query.search;
        const allUser = await prisma.user.findMany({
            where: {
                OR: [
                    {name: {contains: search?.toString() || ""}},
                ]
            }
        })
        return res.status(200).json({
            message: "Success",
            data: allUser
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const updateUser = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const id = req.params.id;
        
        const findUser = await prisma.user.findFirst({
            where: {
                id: Number(id)
            }
        })
        
        if(!findUser){
            return res.status(200).json({
                message: "User tidak ditemukan"
            })
        }
        const {nama, email, no_hp, jurusan,} = req.body;

        const saveUser = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                name: nama ?? findUser.name,
                email: email ?? findUser.email,
                numberPhone: no_hp ?? findUser.numberPhone,
                jurusan: jurusan ?? findUser.jurusan
            }
        })

        return res.status(200).json({
            message: `User berhasil diupdate`,
            data: saveUser
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const deleteUser = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const id = req.params.id;

        const findUser = await prisma.user.findFirst({
            where: {
                id: Number(id)
            }
        })

        if (!findUser){
            return res.status(200).json({
                message: "User tidak ditemukan"
            }
            )
        }

        const deleteUser = await prisma.user.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json({
            message: `User berhasil dihapus`,
            data: deleteUser
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const authenticateUser = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const {email, password} = req.body;

        const findUser = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!findUser){
            return res.status(400).json({
                message: "User tidak ditemukan"
            })
        }

        const isMatchPassword = await bcrypt.compare(password, findUser.password);

        if(!isMatchPassword){
            return res.status(400).json({
                message: `Password salah`
            })
        }

        const payload = {
            email: findUser.email,
            role: findUser.role
        }
        const signature = process.env.SECRET || ''

        const token = Jwt.sign(payload, signature)

        return res.status(200).json({
            logged: true,
            token,
            id: findUser.id,
            name: findUser.name,
            email: findUser.email,
            no_hp: findUser.numberPhone,
            jurusan: findUser.jurusan
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

export {createUser, readUser, updateUser, deleteUser, authenticateUser}