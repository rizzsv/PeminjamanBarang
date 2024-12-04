import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Utamakan Kasih Deskripsi Saat Mmebuat Function Agar Tidak Bingung!

const CreateSchema = Joi.object({
    user_id: Joi.number().required().messages({
        'number.base': 'user_id harus berupa angka',
        'any.required': 'user_id wajib diisi'
    }),
    barang_id: Joi.number().required().messages({
        'number.base': 'barang_id harus berupa angka',
        'any.required': 'barang_id wajib diisi'
    }),
    deskripsi: Joi.string().required().messages({
        'string.base': 'deskripsi harus berupa string',
        'any.required': 'deskripsi wajib diisi'
    }),
    borrow_date: Joi.date().iso().required().messages({
        'date.base': 'borrow_date harus berupa tanggal yang valid',
        'any.required': 'borrow_date wajib diisi',
        'date.isoDate': 'borrow_date harus dalam format tanggal ISO yang valid'
    }),
    return_date: Joi.date().iso().optional().greater(Joi.ref('borrow_date')).messages({
        'date.base': 'return_date harus berupa tanggal yang valid',
        'date.isoDate': 'return_date harus dalam format tanggal ISO yang valid',
        'date.greater': 'return_date harus lebih besar atau sama dengan borrow_date'
    })
});

const CreateValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const { error } = CreateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details.map((detail) => detail.message).join(', ') // Menampilkan semua pesan error
        });
    }
    next();
}

export { CreateValidation };
