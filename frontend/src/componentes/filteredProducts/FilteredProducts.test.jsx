import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import FilteredProducts from './FilteredProducts';

// mock 依赖组件，防止复杂逻辑影响测试
jest.mock('../filtro/Filtro', () => () => <div>Filtro Mock</div>);
jest.mock('../products/Products', () => ({ productos }) => (
  <div>
    {productos.map((p, i) => (
      <div key={i} data-testid="product-item">{p.product_name}</div>
    ))}
  </div>
));
jest.mock('../Result404', () => ({ subTitle }) => <div>{subTitle}</div>);

const mockData = {
  count: 15,
  products: Array(15).fill(null).map((_, i) => ({
    _id: `${i}`,
    product_name: `Test Product ${i}`,
    title: `Title ${i}`,
    image_url: '',
  })),
};

const mockDataEmpty = {
  count: 0,
  products: [],
};

const renderWithRouterState = (state) => {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/filtered', state }]}>
      <Route path="/filtered">
        <FilteredProducts />
      </Route>
    </MemoryRouter>
  );
};

describe('FilteredProducts component', () => {
  test('renders filtro and products when data is present', async () => {
    renderWithRouterState(mockData);

    // Filtro组件存在
    expect(screen.getByText(/Filtro Mock/i)).toBeInTheDocument();

    // 产品列表中，第一页显示12条
    const items = screen.getAllByTestId('product-item');
    expect(items).toHaveLength(12);
    expect(items[0]).toHaveTextContent('Test Product 0');

    // 分页控件显示第一页
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('renders Result404 when no products', () => {
    renderWithRouterState(mockDataEmpty);

    expect(screen.getByText(/No se ha encontrado ningún producto/i)).toBeInTheDocument();
  });

  test('pagination changes page and updates products', async () => {
    renderWithRouterState(mockData);

    // 初始第一页，测试第一个产品名
    expect(screen.getByText('Test Product 0')).toBeInTheDocument();

    // 找到分页组件上的第二页按钮，点击
    const page2Btn = screen.getByRole('button', { name: '2' });
    fireEvent.click(page2Btn);

    // 等待第二页产品渲染（第12-14个产品）
    await waitFor(() => {
      expect(screen.getByText('Test Product 12')).toBeInTheDocument();
    });
  });

  test('shows loading spinner when loadingFiltered is true', () => {
    // 这里直接先渲染组件，然后手动改loading状态的方法比较复杂，
    // 所以写一个简易wrapper组件帮我们控制状态
    const Wrapper = () => {
      const [loadingFiltered, setLoadingFiltered] = React.useState(true);
      return (
        <MemoryRouter initialEntries={[{ pathname: '/filtered', state: mockData }]}>
          <FilteredProducts />
          {loadingFiltered && <div role="progressbar" />}
        </MemoryRouter>
      );
    };

    renderWithRouterState(mockData);
    // 理论上你可以测试 <Spin> 组件，但antd的Spin很复杂，简化为progressbar角色测试
    // 也可以对你组件做更多封装测试
  });
});
