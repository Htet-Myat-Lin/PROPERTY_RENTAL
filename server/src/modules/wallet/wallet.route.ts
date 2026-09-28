import { protect, restrictTo } from "@/middleware/auth.middleware";
import { validate, validateParams } from "@/middleware/validation.middleware";
import { Router } from "express";
import {
    approveDepositRequest,
    createWalletIfNotExist,
    deposit,
    getAllDepositRequests,
    getDepositRequestsByTenant,
    getMyWallet,
    getWalletTransactions,
    rejectDepositRequest,
    withdrawal,
} from "./wallet.controller";
import { depositRequestParamsSchema, depositSchema } from "./wallet.validation";

const router = Router();

router.use(protect);

router.get('/', restrictTo("TENANT", "LANDLORD"), getMyWallet);
router.post('/', restrictTo("TENANT", "LANDLORD"), createWalletIfNotExist);
router.patch('/deposit', restrictTo("TENANT"), validate(depositSchema), deposit);
router.patch('/withdrawal', restrictTo("TENANT", "LANDLORD"), withdrawal);
router.patch('/deposit/:id/approve', restrictTo("ADMIN"), validateParams(depositRequestParamsSchema), approveDepositRequest);
router.patch('/deposit/:id/reject', restrictTo("ADMIN"), validateParams(depositRequestParamsSchema), rejectDepositRequest);
router.get('/transactions', restrictTo("TENANT", "LANDLORD"), getWalletTransactions);
router.get('/deposit-requests', restrictTo("ADMIN"), getAllDepositRequests);
router.get('/tenant/deposit-requests', restrictTo("TENANT"), getDepositRequestsByTenant);

export { router as walletRouter };
