import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows user email and triggers logout', () => {
    const logout = jest.fn();
    useAuth.mockReturnValue({ user: { email: 'user@example.com' }, logout });

    render(<Navbar />);

    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Logout/i));
    expect(logout).toHaveBeenCalled();
  });

  test('renders empty placeholder when no user', () => {
    useAuth.mockReturnValue({ user: null, logout: jest.fn() });

    const { container } = render(<Navbar />);

    expect(container.querySelector('span')).toBeNull();
    expect(screen.queryByText(/Logout/i)).toBeNull();
  });
});
