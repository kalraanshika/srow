import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import UserDashboard from "./pages/user/UserDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployeeProblemForm from "./pages/employee/EmployeeProblemForm"; 
import AdminEmployeeIssues from "./pages/admin/AdminEmployeeIssues";
import Userroutes from "./pages/user/UserRoute";
import Employeeroutes from "./pages/employee/EmployeeRoute";
import Adminroutes from "./pages/admin/AdminRoute";
import BinMonitoringUser from "./pages/user/BinMonitoringUser";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/routes"
          element={
            <ProtectedRoute role="user">
              <Userroutes />
            </ProtectedRoute>
          }
        />
         <Route
          path="/user/binMonitor"
          element={
            <ProtectedRoute role="user">
              <BinMonitoringUser/>
            </ProtectedRoute>
          }
        />
       

        <Route
          path="/employee"
          element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/problems"
          element={
            <ProtectedRoute role="employee">
              <EmployeeProblemForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/routes"
          element={
            <ProtectedRoute role="employee">
              <Employeeroutes />
            </ProtectedRoute>
          }
        />
         <Route
          path="/employee/binMonitor"
          element={
            <ProtectedRoute role="employee">
              <BinMonitoringUser/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/issues"
          element={
            <ProtectedRoute role="admin">
              <AdminEmployeeIssues />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/routes"
          element={
            <ProtectedRoute role="admin">
              <Adminroutes />
            </ProtectedRoute>
          }
        />
         <Route
          path="/admin/binMonitor"
          element={
            <ProtectedRoute role="admin">
              <BinMonitoringUser/>
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
