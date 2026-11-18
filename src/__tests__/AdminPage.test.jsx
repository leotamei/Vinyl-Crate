import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { InventoryProvider } from '../context/InventoryContext';
import AdminPage from '../pages/AdminPage';

test('shows validation error messages when submitting an empty form', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <InventoryProvider>
        <AdminPage />
      </InventoryProvider>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(await screen.findByText(/album name is required/i)).toBeInTheDocument();
  expect(screen.getByText(/select or enter a valid genre/i)).toBeInTheDocument();
  expect(screen.getByText(/price must be greater than \$0\.00/i)).toBeInTheDocument();
});