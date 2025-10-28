import axiosInstance from '../api/axiosInstance';

test('axios instance has baseURL', () => {
  expect(axiosInstance.defaults.baseURL).toBeDefined();
});
