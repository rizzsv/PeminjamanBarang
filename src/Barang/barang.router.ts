import { Router } from "express";
import {CreateItem, ReadItem, UpdateItem, DeleteItem} from "./barang.controller";
import {CreateBorrow, CreateReturn, usageReport} from "../Peminjaman/peminjaman.controller"
import {CreateValidation} from "../Peminjaman/peminjaman.validation"
import {CreateItemValidation, UpdateItemValidation} from "./barang.validation";
import { adminAuthorization } from "./barang.validation";

const router = Router();

router.post('/', [adminAuthorization,CreateItemValidation], CreateItem);
router.get('/:id', [adminAuthorization], ReadItem);
router.put('/:id', [adminAuthorization,UpdateItemValidation], UpdateItem);
router.delete('/:id', [adminAuthorization], DeleteItem);

//peminjaman
router.post('/peminjaman', [CreateValidation], CreateBorrow);

//pengembalian
router.post('/pengembalian', CreateReturn);

//analyse
router.post('/usage-report', usageReport);   





export default router;