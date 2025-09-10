import express from "express";
import { createSalarySlip, updateSalarySlip } from "../controllers/salaryController.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";
import { updateExpenseStatus } from "../controllers/expenseController.js"; 

const router = express.Router();

// Admin: Create & Update Salary Slips
router.post("/salary-slip", protect, authorizeRoles("Admin"), createSalarySlip);
router.put("/salary-slip/:id", protect, authorizeRoles("Admin"), updateSalarySlip);

// Expenses approval/rejection
router.put("/expense/:id", protect, authorizeRoles("Admin"), updateExpenseStatus);

export default router;
