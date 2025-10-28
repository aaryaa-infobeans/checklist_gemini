jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn() } }));
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TemplateListPage from '../pages/templates/TemplateListPage';

const mockTemplates = [{ id: 1, name: 'T1', category: 'CatA' }];

const mockApi = {
  fetchTemplates: jest.fn(() => Promise.resolve(mockTemplates)),
  createTemplate: jest.fn((p) => Promise.resolve({ id: 2, ...p })),
  updateTemplate: jest.fn((id, p) => Promise.resolve({ id, ...p })),
  deleteTemplate: jest.fn((id) => {
  if (Number(id) === 1) return Promise.reject({ response: { data: { detail: 'In use' } } });
    return Promise.resolve({});
  }),
};

test('renders templates and allows create and edit', async () => {
  render(<TemplateListPage api={mockApi} initialTemplates={mockTemplates} />);

  // initialTemplates seeds synchronously
  expect(await screen.findByText(/T1/)).toBeInTheDocument();

  // create new
  fireEvent.click(screen.getByText(/New Template/));
  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New T' } });
  fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'C1' } });
  fireEvent.click(screen.getByText(/Save/));

  await waitFor(() => expect(mockApi.createTemplate).toHaveBeenCalled());
  expect(await screen.findByText('New T')).toBeInTheDocument();

  // edit existing
  fireEvent.click(screen.getAllByText(/Edit/)[0]);
  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'T1 Edited' } });
  fireEvent.click(screen.getByText(/Save/));
  await waitFor(() => expect(mockApi.updateTemplate).toHaveBeenCalled());
  expect(await screen.findByText('T1 Edited')).toBeInTheDocument();
});

test('delete shows server rule error when in use', async () => {
  render(<TemplateListPage api={mockApi} initialTemplates={mockTemplates} />);
  expect(await screen.findByText(/T1/)).toBeInTheDocument();
  // mock confirm to return true
  jest.spyOn(window, 'confirm').mockImplementation(() => true);
  const { toast } = require('react-toastify');
  // ensure delete rejects for this test run
  mockApi.deleteTemplate.mockImplementationOnce((id) => Promise.reject({ response: { data: { detail: 'In use' } } }));

  fireEvent.click(screen.getAllByText(/Delete/)[0]);
  await waitFor(() => expect(mockApi.deleteTemplate).toHaveBeenCalledWith(1));
  await waitFor(() => expect(toast.error).toHaveBeenCalled());

  jest.restoreAllMocks();
});

