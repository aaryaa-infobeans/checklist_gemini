import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '../pages/auth/RegisterPage';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../api/axiosInstance', () => ({
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

import axiosInstance from '../api/axiosInstance';

test('register form submits and shows success message', async () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    </AuthProvider>
  );

  fireEvent.change(screen.getByLabelText(/Full name/i), { target: { value: 'Test User' } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

  fireEvent.click(screen.getByRole('button', { name: /Create account/i }));

  await waitFor(() => expect(axiosInstance.post).toHaveBeenCalledWith('/auth/register/', expect.any(Object)));
  expect(await screen.findByText(/Registration successful/i)).toBeInTheDocument();
});
