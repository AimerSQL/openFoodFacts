import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Filtro from './Filtro';
import Servicios from '../Servicios';
import { useNavigate } from 'react-router-dom';

// 模拟 react-router-dom 的 useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// 模拟 Servicios 服务
jest.mock('../Servicios');

describe('Filtro component', () => {
  const mockNavigate = jest.fn();
  const mockOnLoading = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders form fields and allows input', () => {
    render(<Filtro onLoading={mockOnLoading} />);

    // 查找输入框和选择框
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Categorías/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Marca/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Paises de venta/i)).toBeInTheDocument();
    expect(screen.getByText(/Grado de nutrición/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Buscar/i })).toBeInTheDocument();
  });

  test('submits form and navigates on success', async () => {
    Servicios.getFilteredProducts.mockResolvedValueOnce({ count: 1, products: [{ _id: '1', product_name: 'Test' }] });

    render(<Filtro onLoading={mockOnLoading} />);

    // 填写表单
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Apple' } });
    fireEvent.change(screen.getByLabelText(/Categorías/i), { target: { value: 'Fruit' } });
    fireEvent.change(screen.getByLabelText(/Marca/i), { target: { value: 'BrandX' } });
    fireEvent.change(screen.getByLabelText(/Paises de venta/i), { target: { value: 'Spain' } });

    // 选择 NutriScore
    fireEvent.mouseDown(screen.getByRole('combobox'));
    const optionA = await screen.findByText('A');
    fireEvent.click(optionA);

    // 点击按钮
    fireEvent.click(screen.getByRole('button', { name: /Buscar/i }));

    expect(mockOnLoading).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(Servicios.getFilteredProducts).toHaveBeenCalledWith({
        categories: 'Fruit',
        brands: 'BrandX',
        countries: 'Spain',
        name: 'Apple',
        nutriScore: 'a',
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/filtered-products', { state: { count: 1, products: [{ _id: '1', product_name: 'Test' }] } });
      expect(mockOnLoading).toHaveBeenCalledWith(false);
    });
  });

  test('does not submit if all fields empty', () => {
    render(<Filtro onLoading={mockOnLoading} />);
    fireEvent.click(screen.getByRole('button', { name: /Buscar/i }));
    expect(Servicios.getFilteredProducts).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockOnLoading).not.toHaveBeenCalledWith(false);
  });

  test('calls onLoading(false) on error', async () => {
    Servicios.getFilteredProducts.mockRejectedValueOnce(new Error('Fail'));

    render(<Filtro onLoading={mockOnLoading} />);

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Apple' } });

    fireEvent.click(screen.getByRole('button', { name: /Buscar/i }));

    expect(mockOnLoading).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(Servicios.getFilteredProducts).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockOnLoading).toHaveBeenCalledWith(false);
    });
  });
});
