import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ExecutionListPage from './pages/executions/ExecutionListPage';
import ExecutionDetailPage from './pages/executions/ExecutionDetailPage';
import Header from './components/layout/Header';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        <main className="container mx-auto">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/" element={<PrivateRoute><ExecutionListPage /></PrivateRoute>} />
            <Route path="/executions/:id" element={<PrivateRoute><ExecutionDetailPage /></PrivateRoute>} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;