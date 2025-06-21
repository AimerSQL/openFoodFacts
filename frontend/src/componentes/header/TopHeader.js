import { useState, useEffect } from "react";
import upmEtsisiLogo from "../../fotos/upmEtsisiLogo.jpg";
import { AreaChartOutlined, PictureOutlined } from "@ant-design/icons";
import { Layout, Menu, Form, Input,InputNumber, Button, Modal, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Servicios from "../Servicios";
import i18n from "../../i18n";
const { Header } = Layout;
const { Search } = Input;

export default function TopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(location.pathname);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { t } = useTranslation();
  const [form] = Form.useForm();

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
    window.history.replaceState(null, "", "/login");
    navigate("/login");
  };

const addProduct = () => {
  setIsModalVisible(true);
};

const handleOk = async () => {
  try {
    const values = await form.validateFields();
    console.log("Form values:", values);
    const payload = {
      ...values,
      categories: values.categories
        ? values.categories.split(',').map((c) => c.trim())
        : [],
    };

    console.log("Payload to be sent:", payload);
    Servicios.addProduct(payload)

    message.success(t("Producto guardado con éxito"));
    form.resetFields();
    setIsModalVisible(false);
  } catch (error) {
    message.error(t("Error al guardar el producto"));
  }
};


const handleCancel = () => {
  setIsModalVisible(false);
};

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const handlePopState = (e) => {
      window.history.replaceState(null, "", "/login");
      navigate("/login");
    };

    if (location.pathname === "/login") {
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
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
    {
      key: "/favoritos",
      icon: <PictureOutlined />,
      label: <b>{t("favoritos")}</b>,
    },
    {
      key: "/stats",
      icon: <PictureOutlined />,
      label: <b>{t("stats")}</b>,
    },
  ];

return (
    <>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "5px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={upmEtsisiLogo}
            alt="upmEtsisiLogo"
            title="upmEtsisiLogo"
            style={{
              width: 174,
              height: 60,
              marginRight: "5px",
            }}
          />
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[selectedKey]}
            items={items}
            onClick={handleClick}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 0,
              paddingLeft: 0,
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            width: "100%",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <Search
            placeholder={t("Introduce Código de Barra")}
            allowClear
            enterButton={t("Buscar")}
            size="medium"
            onSearch={onSearch}
            style={{
              width: "400px",
              margin: "12px",
            }}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
        </div>
        <div>
          <Button onClick={() => changeLanguage("en")}>EN</Button>
          <Button onClick={() => changeLanguage("es")}>ES</Button>

          {localStorage.getItem("role") === "admin" && (<Button
            type="primary"
            onClick={addProduct}
            style={{
              marginLeft: "20px",
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
            }}
          >
            {t("Añadir producto")}
          </Button>)}

          <Button
            type="primary"
            onClick={handleLogout}
            style={{
              marginLeft: "20px",
              backgroundColor: "#ff4d4f",
              borderColor: "#ff4d4f",
            }}
          >
            {t("Cerrar sesión")}
          </Button>
        </div>
      </Header>
      <Modal
        title={t("Añadir producto")}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={t("Guardar")}
        cancelText={t("Cancelar")}
      >
    <Form form={form} layout="vertical">
    <Form.Item label={t("Nombre del producto")} name="product_name" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item label={t("Marca")} name="brands">
      <Input />
    </Form.Item>
    <Form.Item label={t("País")} name="countries_en">
      <Input />
    </Form.Item>
    <Form.Item label="Energía (100g)" name="energy_100g">
      <InputNumber style={{ width: "100%" }} />
    </Form.Item>
    <Form.Item label="Grasas (100g)" name="fat_100g">
      <InputNumber style={{ width: "100%" }} />
    </Form.Item>
    <Form.Item label="Carbohidratos (100g)" name="carbohydrates_100g">
      <InputNumber style={{ width: "100%" }} />
    </Form.Item>
    <Form.Item label="Azúcares (100g)" name="sugars_100g">
      <InputNumber style={{ width: "100%" }} />
    </Form.Item>
    <Form.Item label="Fibra (100g)" name="fiber_100g">
      <InputNumber style={{ width: "100%" }} />
    </Form.Item>
    <Form.Item label="Proteínas (100g)" name="proteins_100g">
      <InputNumber style={{ width: "100%" }} />
    </Form.Item>
    <Form.Item label="Sal (100g)" name="salt_100g">
      <InputNumber style={{ width: "100%" }} />
    </Form.Item>
    <Form.Item label="Sodio (100g)" name="sodium_100g">
      <InputNumber style={{ width: "100%" }} />
    </Form.Item>
    <Form.Item label={t("URL de la imagen")} name="image_url">
      <Input />
    </Form.Item>
    <Form.Item label={t("Categorías (separadas por coma)")} name="categories">
      <Input placeholder="ej. snacks, comida rápida, patatas" />
    </Form.Item>
    <Form.Item label={t("Nutriscore")} name="nutriscore_grade">
      <Input />
    </Form.Item>
  </Form>
  </Modal>
    </>
  );
}
