// src/pages/EmployeeDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Snackbar, Alert } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import jsPDF from "jspdf";
import "jspdf-autotable";

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext); // logged-in user
  const [salarySlips, setSalarySlips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expenseForm, setExpenseForm] = useState({ description: "", amount: "" });
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");

  useEffect(() => {
    fetchSalarySlips();
    fetchExpenses();
  }, []);

  const fetchSalarySlips = () => {
    API.get("/salary-slip")
      .then(res => {
        const mySlips = res.data.filter(slip => slip.employeeEmail === user.email);
        setSalarySlips(mySlips);
      })
      .catch(console.log);
  };

  const fetchExpenses = () => {
    API.get("/expense")
      .then(res => {
        const myExpenses = res.data.filter(exp => exp.employeeEmail === user.email);
        setExpenses(myExpenses);
      })
      .catch(console.log);
  };

  const submitExpense = async () => {
    if (!expenseForm.description || !expenseForm.amount) {
      alert("Please fill all fields");
      return;
    }
    try {
      await API.post("/expense", expenseForm);
      setExpenseForm({ description: "", amount: "" });
      fetchExpenses();
      showNotification("Expense submitted successfully!");
    } catch (err) {
      console.log(err);
      alert("Failed to submit expense");
    }
  };

  // PDF Export
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Salary Slips", 20, 10);
    const tableColumn = ["ID", "Month", "Amount"];
    const tableRows = salarySlips.map(slip => [slip._id, slip.month, slip.amount]);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("salary_slips.pdf");
  };

  const showNotification = (msg) => {
    setSnackMsg(msg);
    setSnackOpen(true);
  };

  // Prepare data for charts
  const salaryData = salarySlips.map(slip => ({ month: slip.month, amount: parseFloat(slip.amount) }));
  const expenseData = expenses.map(exp => ({ month: exp.month || "N/A", amount: parseFloat(exp.amount) }));

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>Employee Dashboard</Typography>

      {/* Export PDF Button */}
      <Button variant="contained" color="secondary" onClick={exportPDF} sx={{ mb: 2 }}>
        Export Salary Slips PDF
      </Button>

      {/* Salary Slips Table */}
      <Typography variant="h6">Your Salary Slips</Typography>
      <TableContainer component={Paper} sx={{ mb: 4, mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salarySlips.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">No salary slips found</TableCell>
              </TableRow>
            ) : (
              salarySlips.map(slip => (
                <TableRow key={slip._id}>
                  <TableCell>{slip._id}</TableCell>
                  <TableCell>{slip.month}</TableCell>
                  <TableCell>{slip.amount}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Salary Chart */}
      <Typography variant="h6" mt={3}>Salary History</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salaryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <XAxis dataKey="month" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      {/* Submit Expense */}
      <Typography variant="h6" mt={3}>Submit Expense</Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={expenseForm.description}
          onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
        />
        <TextField
          label="Amount"
          fullWidth
          margin="normal"
          value={expenseForm.amount}
          onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
        />
        <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={submitExpense}>
          Submit
        </Button>
      </Paper>

      {/* Expense History Table */}
      <Typography variant="h6">Your Expense History</Typography>
      <TableContainer component={Paper} sx={{ mb: 4, mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No expenses submitted</TableCell>
              </TableRow>
            ) : (
              expenses.map(exp => (
                <TableRow key={exp._id}>
                  <TableCell>{exp._id}</TableCell>
                  <TableCell>{exp.description}</TableCell>
                  <TableCell>{exp.amount}</TableCell>
                  <TableCell>{exp.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Expense Chart */}
      <Typography variant="h6" mt={3}>Expense History Chart</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={expenseData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <XAxis dataKey="month" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {snackMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeDashboard;
