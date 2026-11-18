import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest';
import { InventoryProvider } from '../context/InventoryContext';
import ShopPage from '../pages/ShopPage';

const initialRecords = [
  { id: '1', name: 'Kind of Blue', description: 'Miles Davis • Mint (M)', origin: 'Jazz', price: 34.99 },
  { id: '2', name: 'Rumours', description: 'Fleetwood Mac • Near Mint (NM)', origin: 'Rock', price: 28.50 },
  { id: '3', name: 'Illmatic', description: 'Nas • Very Good Plus (VG+)', origin: 'Hip-Hop', price: 31.00 },
];

beforeEach(() => {
  global.fetch = vi.fn((url, options) => {
    if (!options || options.method === 'GET') {
      if (url.endsWith('/store_info')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(initialRecords) });
    }
    if (options.method === 'PATCH') {
      const body = JSON.parse(options.body);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ...initialRecords[0], ...body }),
      });
    }
    if (options.method === 'DELETE') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    }
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  localStorage.clear();
});

describe('ShopPage Filtering & CRUD Operations', () => {
  test('filters records dynamically by search input and genre checkboxes', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <InventoryProvider>
          <ShopPage />
        </InventoryProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText('Kind of Blue')).toBeInTheDocument();
    expect(screen.getByText('Rumours')).toBeInTheDocument();

    // Filter by Genre checkbox ("Rock")
    await user.click(screen.getByLabelText('Rock'));
    expect(screen.getByText('Rumours')).toBeInTheDocument();
    expect(screen.queryByText('Kind of Blue')).not.toBeInTheDocument();

    // Clear filters and search by text
    await user.click(screen.getByRole('button', { name: /clear filters/i }));
    await user.type(screen.getByPlaceholderText(/search/i), 'Nas');
    expect(screen.getByText('Illmatic')).toBeInTheDocument();
    expect(screen.queryByText('Rumours')).not.toBeInTheDocument();
  });

  test('allows admin to update price (PATCH) via detail modal', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <InventoryProvider>
          <ShopPage />
        </InventoryProvider>
      </MemoryRouter>
    );

    const card = await screen.findByText('Kind of Blue');
    await user.click(card);

    const priceInput = screen.getByLabelText(/price/i);
    await user.clear(priceInput);
    await user.type(priceInput, '39.99');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(await screen.findByText('KSh 39.99')).toBeInTheDocument();
  });

  test('allows admin to delete a record (DELETE) via detail modal', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <InventoryProvider>
          <ShopPage />
        </InventoryProvider>
      </MemoryRouter>
    );

    const card = await screen.findByText('Kind of Blue');
    await user.click(card);

    await user.click(screen.getByRole('button', { name: /delete record/i }));

    expect(screen.queryByText('Kind of Blue')).not.toBeInTheDocument();
  });

  test('uses bundled records and saves edits in browser-only demo mode', async () => {
    vi.stubEnv('PROD', true);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <InventoryProvider>
          <ShopPage />
        </InventoryProvider>
      </MemoryRouter>
    );

    await user.click(await screen.findByText('Kind of Blue'));
    const priceInput = screen.getByLabelText(/price/i);
    await user.clear(priceInput);
    await user.type(priceInput, '4200');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(await screen.findByText('KSh 4,200.00')).toBeInTheDocument();
    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(JSON.parse(localStorage.getItem('vinyl-crate-demo-records'))[0].price).toBe(4200);
  });
});