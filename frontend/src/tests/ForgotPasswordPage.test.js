import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

jest.mock('../api/axiosInstance', () => ({
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

import axiosInstance from '../api/axiosInstance';

test('forgot password submits and shows message', async () => {
  render(<ForgotPasswordPage />);

  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
  fireEvent.click(screen.getByRole('button', { name: /Send reset link/i }));

  await waitFor(() => expect(axiosInstance.post).toHaveBeenCalledWith('/auth/password-reset/', expect.any(Object)));
  expect(await screen.findByText(/reset link has been sent/i)).toBeInTheDocument();
});
