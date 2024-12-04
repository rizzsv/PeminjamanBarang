import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import Joi from 'joi'

const adminAuthorization = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({
                message: "Token tidak ditemukan"
            })
        }
        const token = authHeader.split(" ")[1]
        const signature = process.env.SECRET || ''

        const decoded = jwt.verify(token, signature) as any

        if (decoded.role !== "ADMIN") {
            return res.status(401).json({
                message: "Anda tidak memiliki akses"
            })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: "Token tidak valid"
        })
    }
}

const CreateItem = Joi.object({
    nameItem: Joi.string().required(),
    category: Joi.string().required(),
    location: Joi.string().required(),
    qty: Joi.number().required()
})

const CreateItemValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validate = CreateItem.validate(req.body)
    if (validate.error) {
        return res.status(400).json({
            message: validate.error.message
        })
    }
    return next()
}

const UpdateItem = Joi.object({
    nameItem: Joi.string().optional(),
    category: Joi.string().optional(),
    location: Joi.string().required(),
    qty: Joi.number().required()
})

const UpdateItemValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validate = UpdateItem.validate(req.body)
    if (validate.error) {
        return res.status(400).json({
            message: validate.error.message
        })
    }
    return next()
}

export { CreateItemValidation, UpdateItemValidation, adminAuthorization }