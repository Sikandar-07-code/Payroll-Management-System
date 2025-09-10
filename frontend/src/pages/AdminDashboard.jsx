// src/pages/AdminDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [salarySlips, setSalarySlips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ employeeName: "", employeeEmail: "", month: "", amount: "" });
  const [editId, setEditId] = useState(null);

  // Redirect if not Admin
  useEffect(() => {
    if (!user || user.role !== "Admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch salary slips and expenses
  useEffect(() => {
    fetchSalarySlips();
    fetchExpenses();
  }, []);

  const fetchSalarySlips = () => {
    API.get("/salary-slip")
      .then(res => setSalarySlips(res.data))
      .catch(err => console.log(err));
  };

  const fetchExpenses = () => {
    API.get("/expense")
      .then(res => setExpenses(res.data))
      .catch(err => console.log(err));
  };

  // Open modal for create or edit
  const handleOpen = (slip = null) => {
    if (slip) {
      setFormData({ employeeName: slip.employeeName, employeeEmail: slip.employeeEmail, month: slip.month, amount: slip.amount });
      setEditId(slip._id);
    } else {
      setFormData({ employeeName: "", employeeEmail: "", month: "", amount: "" });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      if (!formData.employeeName || !formData.employeeEmail || !formData.month || !formData.amount) {
        alert("Please fill all fields");
        return;
      }
      if (editId) {
        await API.put(`/salary-slip/${editId}`, formData);
      } else {
        await API.post("/salary-slip", formData);
      }
      fetchSalarySlips();
      handleClose();
    } catch (err) {
      console.log(err);
      alert("Failed to save salary slip");
    }
  };

  // Approve or reject expense
  const handleExpenseAction = async (id, status) => {
    try {
      await API.put(`/expense/${id}`, { status });
      fetchExpenses();
    } catch (err) {
      console.log(err);
      alert("Failed to update expense");
    }
  };

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button variant="outlined" color="secondary" onClick={() => { logoutUser(); navigate("/login"); }}>Logout</Button>
      </Box>

      {/* Salary Slips Table */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6">Salary Slips</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>Create Salary Slip</Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 4, mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salarySlips.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No salary slips found</TableCell>
              </TableRow>
            ) : (
              salarySlips.map(slip => (
                <TableRow key={slip._id}>
                  <TableCell>{slip._id}</TableCell>
                  <TableCell>{slip.employeeName}</TableCell>
                  <TableCell>{slip.employeeEmail}</TableCell>
                  <TableCell>{slip.month}</TableCell>
                  <TableCell>{slip.amount}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" onClick={() => handleOpen(slip)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Expense Approvals Table */}
      <Typography variant="h6" mt={3}>Employee Expenses</Typography>
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No expenses submitted</TableCell>
              </TableRow>
            ) : (
              expenses.map(exp => (
                <TableRow key={exp._id}>
                  <TableCell>{exp._id}</TableCell>
                  <TableCell>{exp.employeeName}</TableCell>
                  <TableCell>{exp.description}</TableCell>
                  <TableCell>{exp.amount}</TableCell>
                  <TableCell>{exp.status}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={() => handleExpenseAction(exp._id, "Approved")}>Approve</Button>
                    <Button variant="contained" color="error" onClick={() => handleExpenseAction(exp._id, "Rejected")}>Reject</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Salary Slip Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? "Edit Salary Slip" : "Create Salary Slip"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Employee Name"
            fullWidth
            margin="normal"
            value={formData.employeeName}
            onChange={e => setFormData({ ...formData, employeeName: e.target.value })}
          />
          <TextField
            label="Employee Email"
            fullWidth
            margin="normal"
            value={formData.employeeEmail}
            onChange={e => setFormData({ ...formData, employeeEmail: e.target.value })}
          />
          <TextField
            label="Month"
            fullWidth
            margin="normal"
            value={formData.month}
            onChange={e => setFormData({ ...formData, month: e.target.value })}
          />
          <TextField
            label="Amount"
            fullWidth
            margin="normal"
            value={formData.amount}
            onChange={e => setFormData({ ...formData, amount: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>{editId ? "Update" : "Create"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
