import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import { AuthProvider } from '../context/AuthContext';

test('renders login page', () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </AuthProvider>
  );
  expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
});
