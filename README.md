Payroll Management System
📂 Project Structure
/frontend   → React + Material UI frontend
/backend    → Node.js + Express + MongoDB backend
README.md   → This documentation

🖥 Tech Stack

Frontend: React, React Router DOM, Material UI, jsPDF (PDF export), Chart.js (optional charts), MUI Snackbar (notifications)
Backend: Node.js, Express, MongoDB, JWT authentication
Optional/Bonus: Role-based authentication, expense approval workflow, PDF export, in-app notifications

Why this stack:

MERN allows full-stack JavaScript, which speeds up development.

Material UI provides clean, responsive, and professional-looking components with built-in styling and animations.

jsPDF enables exporting salary slips as PDFs.

Chart.js allows visualizing salary and expense history.

JWT & AuthContext secure routes and manage login sessions.

⚡ Features
MVP

Login / Signup with Admin & Employee roles

Admin: Create / Update salary slips

Employee: Submit monthly expenses

Dashboard: View salary slips & expense history

Optional (Good-to-Have)

Charts for salary & expense history

Expense approval / rejection workflow (Admin)

Notifications (in-app Snackbar)

Export salary slips as PDF

🚀 Setup Instructions
1. Clone the repo
git clone https://github.com/Sikandar-07-code/Payroll-Management-System
cd Payroll Management System

2. Backend Setup
cd backend
npm install
npm start


Backend runs on http://localhost:5000 (default)

MongoDB must be running locally or provide a connection URI in .env

3. Frontend Setup
cd ../frontend
npm install
npm run dev


Frontend runs on http://localhost:5173

🔑 Demo Login

Admin

Email: hire-me@anshumat.org

Password: HireMe@2025!

Employee

Email: hire-me@anshumat.org

Password: HireMe@2025!

📝 How to Use

Navigate to /login or /signup

After login:

Admin → /admin dashboard

Employee → /employee dashboard

Admin can create or edit salary slips, approve/reject employee expenses

Employee can submit expenses and download salary slips as PDF

💡 Additional Notes

Role-based ProtectedRoute ensures users can only access their dashboard

PDF export for salary slips via jsPDF

In-app notifications for successful operations via MUI Snackbar

Fully responsive UI with Material UI
