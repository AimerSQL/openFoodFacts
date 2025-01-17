import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Servicios from "../service/Servicios"; // 导入自定义的服务

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const data = {
    username: username,
    password: password,
  };

  const handleLogin = () => {
    console.log("Sending login request", data);
    // 使用 Servicios 发送登录请求
    Servicios.getUserCredentical(data)
      .then((response) => {
        // 检查响应是否成功
        if (response.success) {
          // 登录成功，存储 token
          localStorage.setItem("token", response.token);
          console.log("Login successful");
          // 导航到受保护的页面
          navigate("/menu");
        } else {
          console.log("Login failed: ", response.message);
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => navigate("/register")}>Register</button>
    </div>
  );
}

export default Login;
