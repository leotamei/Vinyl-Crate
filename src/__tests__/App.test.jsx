import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, beforeEach, afterEach, test, expect } from 'vitest';
import { InventoryProvider } from '../context/InventoryContext';
import App from '../App';

const mockStoreInfo = [
  {
    id: '1',
    name: 'VinylCrate',
    tagline: 'The go-to crate for classic pressings & fresh wax.',
    description: 'Independent neighborhood record shop.',
    phone_number: '555-0194',
    address: '412 Groove Ave, Suite B',
    hours: 'Tue–Sun: 11:00 AM – 8:00 PM',
  },
];

const mockRecords = [
  {
    id: '1',
    name: 'Kind of Blue',
    description: 'Miles Davis • Mint (M)',
    origin: 'Jazz',
    price: 34.99,
  },
];

beforeEach(() => {
  global.fetch = vi.fn((url) => {
    if (url.endsWith('/store_info')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(mockStoreInfo) });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve(mockRecords) });
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('navigates between Home, Shop, and Admin Portal routes', async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter initialEntries={['/']}>
      <InventoryProvider>
        <App />
      </InventoryProvider>
    </MemoryRouter>
  );

  // 1. Starts on Home route
  expect(await screen.findByRole('heading', { name: /vinylcrate/i })).toBeInTheDocument();

  // 2. Navigate to Shop route
  await user.click(screen.getByRole('link', { name: /shop/i }));
  expect(await screen.findByText('Kind of Blue')).toBeInTheDocument();

  // 3. Navigate to Admin Portal route
  await user.click(screen.getByRole('link', { name: /admin portal/i }));
  expect(screen.getByRole('heading', { name: /add new vinyl pressing/i })).toBeInTheDocument();
});