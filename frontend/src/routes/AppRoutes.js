import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import ProjectManagerDashboard from '../pages/dashboards/ProjectManagerDashboard';
import EndUserDashboard from '../pages/dashboards/EndUserDashboard';
import AuditorDashboard from '../pages/dashboards/AuditorDashboard';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/admin"
      element={<PrivateRoute roles={["admin"]}><AdminDashboard /></PrivateRoute>}
    />
    <Route
      path="/manager"
      element={<PrivateRoute roles={["project_manager"]}><ProjectManagerDashboard /></PrivateRoute>}
    />
    <Route
      path="/auditor"
      element={<PrivateRoute roles={["auditor"]}><AuditorDashboard /></PrivateRoute>}
    />
    <Route
      path="/"
      element={<PrivateRoute roles={["end_user", "app_user", "admin","project_manager","auditor"]}><EndUserDashboard /></PrivateRoute>}
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
