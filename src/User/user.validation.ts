import { UserRole } from "@prisma/client";
import { Request, Response, NextFunction } from "express"; 
import Joi from "joi";

const CreateUser = Joi.object({
    name: Joi.string().required(),
    role: Joi.string().valid("ADMIN", "USER").required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    numberPhone: Joi.string().required(),
    jurusan: Joi.string().required()
})

const CreateUserValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const validate = CreateUser.validate(req.body);
    if (validate.error){
        res.status(400).json({
            message: validate.error.message
        })
    }
    next();
};

const UpdateUser = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    no_hp: Joi.string().required(),
    jurusan: Joi.string().required(),
    role: Joi.string().required()
});

const UpdateUserValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const validate = UpdateUser.validate(req.body);
    if (validate.error){
        res.status(400).json({
            message: validate.error.details.map(item => item.message).join()
        })
    }
};

const DeleteUser = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
})

const DeleteUserValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const validate = DeleteUser.validate(req.body);
    if (validate.error){
        res.status(400).json({
            message: validate.error.message
        })
    }
    next();
}

const authSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const authValidation = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validate = authSchema.validate(req.body)
    if(validate.error){
        return res.status(400).json({
            message: validate
            .error
            .details
            .map(item => item.message)
            .join()
        })
    }
}

export { CreateUserValidation, UpdateUserValidation, DeleteUserValidation, authValidation };