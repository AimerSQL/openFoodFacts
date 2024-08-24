import React, { useState, useEffect } from "react";
import upmEtsisiLogo from "../fotos/upmEtsisiLogo.jpg";
import { AreaChartOutlined, PictureOutlined } from "@ant-design/icons";
import { Layout, Menu, Input } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
const { Header } = Layout;
const { Search } = Input;

export default function TopHeader() {
  const { t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

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

  const items = [
    {
      key: "/menu",
      icon: <PictureOutlined />,
      label: <b>{t("menu")}</b>,
    },
    {
      label: <b>{t("grafica")}</b>,
      key: "/grafica",
      icon: <AreaChartOutlined />,
      children: [
        {
          label: t("humedad"),
          key: "/grafica/humedad",
        },
        {
          label: t("temperatura"),
          key: "/grafica/temperatura",
        },
        {
          label: t("eco2"),
          key: "/grafica/eco2",
        },
        {
          label: t("tvoc"),
          key: "/grafica/tvoc",
        },
      ],
    },
  ];

  return (
    <Header>
      <img
        src={upmEtsisiLogo}
        alt={"upmEtsisiLogo"}
        title={"upmEtsisiLogo"}
        style={{
          float: "left",
          width: 174,
          height: 60,
          margin: "2px 3px 0px -46px",
          background: "rgba(255, 255, 255, 0.2)",
        }}
      />
      <div
        style={{
          float: "left",
          width: 174,
          height: 60,
          margin: "2px 3px 0px -46px",
          background: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <button onClick={() => changeLanguage("en")}>English</button>
        <button onClick={() => changeLanguage("es")}>Español</button>
      </div>
      <div style={{ float: "right", marginRight: 20, color: "#F8F8FF" }}>
        <Search
          placeholder="Introduce Código de Barra"
          allowClear
          enterButton="Buscar"
          size="large"
          onSearch={onSearch}
          style={{
            margin: "12px",
          }}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />
      </div>

      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        items={items}
        onClick={handleClick}
      >
        {renderMenu(items)}
      </Menu>
    </Header>
  );
}
