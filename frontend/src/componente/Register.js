import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import register from '../fotos/register.jpg';

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
      if (response.status === 201) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert("" + response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message || "Registration failed");
      } else {
        console.error("There was an error with the registration:", error);
        alert("An error occurred during registration.");
      }
    }
  };

  const [isHovered, setIsHovered] = useState(false);
  return (
    <div style={styles.container}>
      <button 
        onClick={() => navigate("/login")} 
        style={{ ...styles.arrowButton, transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
        onMouseEnter={() => setIsHovered(true)} // 鼠标进入时放大
        onMouseLeave={() => setIsHovered(false)} // 鼠标离开时恢复
      >
         <span style={styles.arrowIcon}>←</span>
      </button>
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
    backgroundImage: `url(${register})`,
    backgroundSize: 'cover', // 使背景图片覆盖整个容器
    backgroundPosition: 'center', // 将背景图片居中
    backgroundRepeat: 'no-repeat', // 防止背景图片重复
    position: 'relative',
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
  arrowButton: {
    position: 'absolute', // 使按钮浮动
    top: '100px',          // 距离顶部20px
    left: '100px',         // 距离左侧20px
    width: '70px',        // 增大按钮的宽度
    height: '70px',       // 增大按钮的高度
    borderRadius: '50%',  // 圆形按钮
    backgroundColor: 'white',  // 白色背景
    color: 'black',       // 黑色箭头
    fontSize: '60px',      // 增大字体大小
    border: 'none',       // 无边框
    cursor: 'pointer',     // 鼠标悬停时显示指针
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 阴影效果
    transition: 'transform 0.3s ease',
  },
  arrowIcon: {
    position: 'absolute', // 使用绝对定位
    top: '40%',           // 垂直居中
    left: '50%',          // 水平居中
    transform: 'translate(-50%, -50%)', // 精确居中箭头
    fontSize: '60px',
    fontWeight: 'bolder',
  },
};

export default Register;
