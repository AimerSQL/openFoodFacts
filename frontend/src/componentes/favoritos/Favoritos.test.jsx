import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Favoritos from './Favorito';
import Servicios from '../Servicios';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = IntersectionObserver;

jest.mock('../Servicios');

const mockFavoritos = Array(10).fill(null).map((_, i) => ({
  _id: String(i),
  product_name: `Test Product ${i}`,
  title: `Product Title ${i}`,
  image_url: '',
}));


beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('Favoritos component', () => {
  beforeEach(() => {
    Servicios.getFavoritos.mockResolvedValue(mockFavoritos);
  });

  it('renders loading skeleton initially', () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <Favoritos />
        </I18nextProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders product cards after data fetch', async () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <Favoritos />
        </I18nextProvider>
      </MemoryRouter>
    );

    // 等待任意一条商品名出现
    await waitFor(() => {
      expect(screen.getByText(/Test Product 0/i)).toBeInTheDocument();
    });

    // 标题应该出现
    expect(screen.getByText(/Mis Favoritos/i)).toBeInTheDocument();
  });

  it('renders "Cargar más" button', async () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <Favoritos />
        </I18nextProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Cargar más/i })).toBeInTheDocument();
    });
  });
});
