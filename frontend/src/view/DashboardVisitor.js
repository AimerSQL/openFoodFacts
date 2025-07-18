import "./DashboardVisitor.css";
import React from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import TopHeader from "../componentes/header/TopHeader";
import { Layout, Statistic, theme } from "antd";
import Grafica from "../componentes/grafica/Grafica";
import Menu from "../componentes/menu/Menu";
import FoodInfo from "../componentes/foodInfo/FoodInfo";
import FilteredProducts from "../componentes/filteredProducts/FilteredProducts";
import Login from "../componentes/login/Login";
import Register from "../componentes/register/Register";
import PrivateRoute from "../componentes/PrivateRoute";
import Favorito from "../componentes/favoritos/Favorito";
import Stats from "../componentes/stats/Stats";
const { Content, Footer } = Layout;

export default function DashboardVisitor(props) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <BrowserRouter>
      <DashboardVisitorContent />
    </BrowserRouter>
  );
}

function DashboardVisitorContent() {
  const location = useLocation();

  // 判断当前路径是否为 /login 或 /register
  const isLoginOrRegister =
    location.pathname === "/login" || location.pathname === "/register";

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      {/* 只有在登录和注册页面不显示 TopHeader */}
      {!isLoginOrRegister && <TopHeader />}

      <Layout>
        <Content
          style={{
            padding: 20,
            minHeight: 380,
            background: colorBgContainer,
          }}
        >
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/favoritos" element={<Favorito />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/menu" element={<PrivateRoute element={<Menu />} />} />
            <Route
              path="/grafica"
              element={<Navigate to="/grafica/humedad" />}
            />
            <Route
              path="/grafica/humedad"
              element={<Grafica dataType="humedad" title="humedad" />}
            />
            <Route
              path="/grafica/temperatura"
              element={<Grafica dataType="temperatura" title="temperatura" />}
            />
            <Route
              path="/grafica/Eco2"
              element={<Grafica dataType="eco2" title="Eco2" />}
            />
            <Route
              path="/grafica/Tvoc"
              element={<Grafica dataType="tvoc" title="Tvoc" />}
            />
            <Route
              path="/foodInfo/:id"
              element={<PrivateRoute element={<FoodInfo />} />}
            />
            <Route path="/filtered-products" element={<FilteredProducts />} />
          </Routes>
        </Content>
      </Layout>

      <Footer style={{ textAlign: "center" }}>
        TFM UPM Ingeniero Web 2024 - 2025
      </Footer>
    </Layout>
  );
}
