import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import ProjectManagerDashboard from '../pages/dashboards/ProjectManagerDashboard';
import EndUserDashboard from '../pages/dashboards/EndUserDashboard';
import AuditorDashboard from '../pages/dashboards/AuditorDashboard';
import TemplateListPage from '../pages/templates/TemplateListPage';
import TemplateFormPage from '../pages/templates/TemplateFormPage';
import ExecutionListPage from '../pages/executions/ExecutionListPage';
import ExecutionDetailPage from '../pages/executions/ExecutionDetailPage';
import ReportsPage from '../pages/reports/ReportsPage';
import AuditLogsPage from '../pages/reports/AuditLogsPage';
import PrivateRoute from './PrivateRoute';
import MainLayout from '../components/common/MainLayout';

const AppRoutesExpanded = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

  <Route path="/templates" element={<PrivateRoute><MainLayout><TemplateListPage /></MainLayout></PrivateRoute>} />
  <Route path="/templates/new" element={<PrivateRoute roles={["admin","project_manager"]}><MainLayout><TemplateFormPage /></MainLayout></PrivateRoute>} />

  <Route path="/executions" element={<PrivateRoute><MainLayout><ExecutionListPage /></MainLayout></PrivateRoute>} />
  <Route path="/executions/:id" element={<PrivateRoute><MainLayout><ExecutionDetailPage /></MainLayout></PrivateRoute>} />

    <Route path="/reports" element={<PrivateRoute roles={["admin","project_manager","auditor"]}><ReportsPage /></PrivateRoute>} />
    <Route path="/audit-logs" element={<PrivateRoute roles={["auditor"]}><AuditLogsPage /></PrivateRoute>} />

  <Route path="/admin" element={<PrivateRoute roles={["admin"]}><MainLayout><AdminDashboard /></MainLayout></PrivateRoute>} />
  <Route path="/manager" element={<PrivateRoute roles={["project_manager"]}><MainLayout><ProjectManagerDashboard /></MainLayout></PrivateRoute>} />
  <Route path="/auditor" element={<PrivateRoute roles={["auditor"]}><MainLayout><AuditorDashboard /></MainLayout></PrivateRoute>} />
  <Route path="/" element={<PrivateRoute><MainLayout><EndUserDashboard /></MainLayout></PrivateRoute>} />
  </Routes>
);

export default AppRoutesExpanded;
