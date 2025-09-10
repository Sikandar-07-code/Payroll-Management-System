import Expense from "../models/Expense.js";
import { sendNotification } from "../utils/sendNotification.js";

// @desc Submit new expense (Employee only)
export const createExpense = async (req, res) => {
  try {
    const { amount, description } = req.body;

    const expense = await Expense.create({
      employee: req.user.id,
      amount,
      description,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in employee's expenses
export const getMyExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ employee: req.user.id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Approve or Reject an expense (Admin only)
export const updateExpenseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    expense.status = status;
    await expense.save();

    await sendNotification(expense.employee, `Your expense was ${status}.`);

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
