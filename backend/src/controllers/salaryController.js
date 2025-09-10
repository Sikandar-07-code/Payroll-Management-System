import SalarySlip from "../models/SalarySlip.js";
import User from "../models/User.js";
import { sendNotification } from "../utils/sendNotification.js";
import PDFDocument from "pdfkit";

// @desc Create salary slip (Admin only)
export const createSalarySlip = async (req, res) => {
  try {
    const { employeeId, month, year, amount, remarks } = req.body;

    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== "Employee") {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    const slip = await SalarySlip.create({
      employee: employeeId,
      month,
      year,
      amount,
      remarks,
    });

    // ✅ Send notification to employee AFTER creating the salary slip
    await sendNotification(
      slip.employee,
      `Your salary slip for ${slip.month}/${slip.year} has been generated.`
    );

    res.status(201).json(slip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update salary slip (Admin only)
export const updateSalarySlip = async (req, res) => {
  try {
    const { id } = req.params;
    const { month, year, amount, remarks } = req.body;

    const slip = await SalarySlip.findById(id);
    if (!slip) return res.status(404).json({ message: "Salary slip not found" });

    slip.month = month || slip.month;
    slip.year = year || slip.year;
    slip.amount = amount || slip.amount;
    slip.remarks = remarks || slip.remarks;

    const updatedSlip = await slip.save();
    res.json(updatedSlip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in employee's salary slips
export const getMySalarySlips = async (req, res) => {
  try {
    const slips = await SalarySlip.find({ employee: req.user.id });
    res.json(slips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Export a salary slip as PDF
export const exportSalarySlipPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const slip = await SalarySlip.findById(id).populate("employee", "name email");

    if (!slip) return res.status(404).json({ message: "Salary slip not found" });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=salary-slip-${id}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text("Salary Slip", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Employee: ${slip.employee.name}`);
    doc.text(`Email: ${slip.employee.email}`);
    doc.text(`Month: ${slip.month}`);
    doc.text(`Year: ${slip.year}`);
    doc.text(`Amount: ₹${slip.amount}`);
    doc.text(`Remarks: ${slip.remarks || "-"}`);

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
