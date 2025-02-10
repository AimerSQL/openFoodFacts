import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      // 发送注册请求到后端
      console.log("",username,password);
      const response = await axios.post("http://localhost:4000/register", {
        username,
        password,
      });

      // 如果注册成功，跳转到登录页面
      if (response.status === 200) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert("Registration failed: " + response.data.message);
      }
    } catch (error) {
      console.error("There was an error with the registration:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
      <h2>Register</h2>
      <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          style={styles.input}
        />
        <button onClick={handleRegister} style={styles.button}>
          Confirm
        </button>
      </div>
    </div>
  );
}
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',  // 水平居中
    alignItems: 'center',      // 垂直居中
    height: '100vh',           // 使容器的高度占满整个视窗
    backgroundColor: '#f0f0f0', // 可自定义背景色
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',      // 使表单内的内容居中
    padding: '20px',
    borderRadius: '8px',       // 圆角
    backgroundColor: 'white',  // 背景色
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 阴影效果
    width: '300px',            // 设置表单宽度
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box', // 确保padding不会影响输入框宽度
  },
  button: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: 'none',
    backgroundColor: '#4CAF50', // 可自定义按钮颜色
    color: 'white',
    fontSize: '16px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Register;
