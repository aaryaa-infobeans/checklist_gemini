import { renderHook, act } from '@testing-library/react';
import useFetch from '../hooks/useFetch';
import axiosInstance from '../api/axiosInstance';

jest.mock('../api/axiosInstance', () => ({
  get: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

test('returns data once request resolves', async () => {
  const payload = { ok: true };
  let resolve;
  axiosInstance.get.mockReturnValueOnce(new Promise((res) => { resolve = res; }));

  const { result } = renderHook(() => useFetch('/templates'));

  expect(result.current.loading).toBe(true);
  expect(result.current.data).toBeNull();

  await act(async () => {
    resolve({ data: payload });
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.data).toEqual(payload);
  expect(result.current.error).toBeNull();
});

test('captures errors from request', async () => {
  const error = new Error('fail');
  let reject;
  axiosInstance.get.mockReturnValueOnce(new Promise((_, rej) => { reject = rej; }));

  const { result } = renderHook(() => useFetch('/templates'));

  await act(async () => {
    reject(error);
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBe(error);
});
