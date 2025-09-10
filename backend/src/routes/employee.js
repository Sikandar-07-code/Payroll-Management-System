import express from "express";
import { getMySalarySlips } from "../controllers/salaryController.js";
import { createExpense, getMyExpenses } from "../controllers/expenseController.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";
import Notification from "../models/Notification.js";
import { exportSalarySlipPDF } from "../controllers/salaryController.js";

const router = express.Router();

// Employee: View salary slips
router.get("/salary-slip", protect, authorizeRoles("Employee"), getMySalarySlips);

// Employee: Submit expense
router.post("/expense", protect, authorizeRoles("Employee"), createExpense);

// Employee: View expenses
router.get("/expense", protect, authorizeRoles("Employee"), getMyExpenses);

// Employee: Get notifications
router.get("/notifications", protect, authorizeRoles("Employee"), async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Employee: Download salary slip as PDF
router.get("/salary-slip/:id/pdf", protect, authorizeRoles("Employee"), exportSalarySlipPDF);


export default router;
