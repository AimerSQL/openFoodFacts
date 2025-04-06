import React from "react";
import { Route, Navigate } from "react-router-dom";

// 检查用户是否已登录
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  // 这里可以添加更多验证 token 的逻辑，比如检查 token 是否过期
  return !!token;
};

const PrivateRoute = ({ element, ...rest }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
