import React, { useState, useEffect } from 'react';
import upmEtsisiLogo from '../fotos/upmEtsisiLogo.jpg';
import { AreaChartOutlined, PictureOutlined,FolderAddOutlined } from '@ant-design/icons';
import { Layout, Menu, Input, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header } = Layout;
const { Search } = Input;

const items = [
  {
    key: '/menu',
    icon: <PictureOutlined />,
    label: <b>Menu</b>,
  },
  {
    label: <b>Grafica</b>,
    key: '/grafica',
    icon: <AreaChartOutlined />,
    children: [
      {
        label: 'Humedad',
        key: '/grafica/humedad',
      },
      {
        label: 'Temperatura',
        key: '/grafica/temperatura',
      },
      {
        label: 'eCo2',
        key: '/grafica/eco2',
      },
      {
        label: 'Tvoc',
        key: '/grafica/tvoc',
      },
    ],
  },
  {
    key:'/favorito',
    icon:<FolderAddOutlined />,
    label:<b>Favorito</b>,
  },
];

export default function TopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location]);

  const handleClick = (e) => {
    navigate(e.key);
  };

  const onSearch = (value) => {
    if (value) {
      navigate(`/foodInfo/${value}`);
    } else {
      navigate(`/menu`);
    }
  };

  const handleLogout = () => {
    // 退出会话后替换历史记录，确保后退按钮只触发一次
    window.history.replaceState(null, '', '/login'); // 第一次替换
    navigate('/login'); // 跳转到登录页面
  };

  useEffect(() => {
    const handlePopState = (e) => {
      // 显示警告并防止后退操作
      alert('Token 已过期，请重新登录');
      // 替换历史记录，阻止用户通过后退按钮返回
      window.history.replaceState(null, '', '/login');
      navigate('/login');
    };

    // 监听后退操作
    if (location.pathname === '/login') {
      // 添加监听器
      window.addEventListener('popstate', handlePopState);
    }

    // 清理事件监听
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location]);

  const renderMenu = (menuList) => {
    return menuList.map((item) => {
      if (item.children) {
        return (
          <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
            {renderMenu(item.children)}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item key={item.key} icon={item.icon}>
            {item.label}
          </Menu.Item>
        );
      }
    });
  };

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',  // 垂直居中
        padding: '5px', // 去掉Header的内边距
      }}
    >
      {/* Left section: Logo and Menu */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Logo */}
        <img
          src={upmEtsisiLogo}
          alt={'upmEtsisiLogo'}
          title={'upmEtsisiLogo'}
          style={{
            width: 174,
            height: 60,
            marginRight: '5px', // Logo 和菜单按钮之间的间距
          }}
        />
        {/* Menu (Left side buttons) */}
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={items}
          onClick={handleClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 0,
            paddingLeft: 0,
          }}
        >
          {renderMenu(items)}
        </Menu>
      </div>

      {/* Center: Search box */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <Search
          placeholder="Introduce Código de Barra"
          allowClear
          enterButton="Buscar"
          size="large"
          onSearch={onSearch}
          style={{
            width: '400px', // Adjust the width as needed
            margin: '12px',
          }}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        />
      </div>

      {/* Right section (cerrar) */}
      <div>
        <Button
          type="primary"
          onClick={handleLogout}
          style={{
            marginLeft: '20px',
            backgroundColor: '#ff4d4f',
            borderColor: '#ff4d4f',
          }}
        >
          Cerrar sesión
        </Button>
      </div>
    </Header>
  );
}
