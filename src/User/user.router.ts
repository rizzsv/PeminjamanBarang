import { Router } from 'express';
import { createUser, readUser, updateUser, deleteUser, authenticateUser } from './user.controller';
import { CreateUserValidation, UpdateUserValidation, DeleteUserValidation, authValidation } from './user.validation';
import verifyToken from "./authorization";
const router = Router();

router.post('/', [CreateUserValidation], createUser);
router.get('/', readUser);
router.put('/:id', [verifyToken, UpdateUserValidation], updateUser);
router.delete('/:id', [verifyToken], deleteUser);
router.post('/auth', authenticateUser);

export default router;


