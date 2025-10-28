import React from 'react';
import { render, screen } from '@testing-library/react';
import ChecklistExecutionView from '../components/checklist/ChecklistExecutionView';

test('renders checklist execution view', () => {
  const template = { title: 'Sample', items: [{ id: 1, title: 'One', completed: false }] };
  render(<ChecklistExecutionView template={template} />);
  expect(screen.getByText(/Sample/i)).toBeInTheDocument();
});
