import React, { useEffect } from 'react';
import { render, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

jest.mock('../api/axiosInstance', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

const ContextConsumer = ({ onReady }) => {
  const ctx = useAuth();
  useEffect(() => {
    if (!ctx.loading) {
      onReady(ctx);
    }
  }, [ctx, onReady]);
  return null;
};

const renderContext = async () => {
  let contextValue;
  const handleReady = (value) => {
    contextValue = value;
  };

  render(
    <AuthProvider>
      <ContextConsumer onReady={handleReady} />
    </AuthProvider>
  );

  await waitFor(() => expect(contextValue).toBeDefined());
  return contextValue;
};

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

test('login stores token and fetches full user profile', async () => {
  const context = await renderContext();
  const partialUser = { email: 'pm@example.com' };
  const hydratedUser = { email: 'pm@example.com', role_name: 'project_manager' };

  axiosInstance.post.mockResolvedValueOnce({ data: { token: 'abc123', user: partialUser } });
  axiosInstance.get.mockResolvedValueOnce({ data: hydratedUser });

  let returned;
  await act(async () => {
    returned = await context.login('pm@example.com', 'secret');
  });

  expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login/', { email: 'pm@example.com', password: 'secret' });
  expect(axiosInstance.get).toHaveBeenCalledWith('/users/me/');
  expect(returned).toEqual(hydratedUser);
  expect(localStorage.getItem('access_token')).toBe('abc123');
  expect(JSON.parse(localStorage.getItem('user'))).toEqual(hydratedUser);
});

test('login returns null for invalid credentials', async () => {
  const context = await renderContext();
  axiosInstance.post.mockRejectedValueOnce({ response: { status: 401 } });

  let returned;
  await act(async () => {
    returned = await context.login('bad@example.com', 'wrong');
  });

  expect(returned).toBeNull();
  expect(localStorage.getItem('access_token')).toBeNull();
  expect(localStorage.getItem('user')).toBeNull();
});

test('logout clears stored credentials', async () => {
  const context = await renderContext();
  localStorage.setItem('access_token', 'token');
  localStorage.setItem('user', JSON.stringify({ email: 'test@example.com' }));

  act(() => {
    context.logout();
  });

  expect(localStorage.getItem('access_token')).toBeNull();
  expect(localStorage.getItem('user')).toBeNull();
});
