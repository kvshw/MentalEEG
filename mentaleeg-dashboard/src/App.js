import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import { auth } from './firebase';
import EmployeeWellbeing from './components/EmployeeWellbeing';
import DepartmentOverview from './components/DepartmentOverview';
import SupportResources from './components/SupportResources';
import Settings from './components/Settings';
import ForgotPassword from './components/ForgotPassword';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/employee-wellbeing" element={user ? <EmployeeWellbeing /> : <Navigate to="/login" />} />
          <Route path="/department-overview" element={user ? <DepartmentOverview /> : <Navigate to="/login" />} />
          <Route path="/support-resources" element={user ? <SupportResources /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
