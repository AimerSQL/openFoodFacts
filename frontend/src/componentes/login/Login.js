import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Servicios from "../Servicios"; // 导入自定义的服务
import food from '../../fotos/food.jpg';
import { Carousel } from "antd";
import image1 from'../../fotos/chorizo.jpg';
import image2 from'../../fotos/macarrones.jpg';
import image3 from'../../fotos/pollo.jpg';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [favorites, setFavorites] = useState("");
  const navigate = useNavigate();

  const data = {
    username: username,
    password: password,
  };

  const handleLogin = async () => {
    try {
      console.log("Sending login request", data);
  
      // 使用 Servicios 发送登录请求
      const response = await Servicios.getUserCredentical(data);
  
      // 检查响应是否成功
      if (response.success) {
        // 登录成功，存储 token
        localStorage.removeItem('currentPage');
        localStorage.setItem("token", response.token);
        console.log("Response:", response);
        localStorage.setItem("user_id", response.user.user_id);
        const favoritos = await Servicios.getProductsByUser(); // 等待获取收藏数据
        console.log("Favoritos:", favoritos); // 打印获取到的收藏数据
        navigate("/menu", { state: { favoritos } });
      } else {
        console.log("Login failed: ", response.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  

  const carouselImages = [
    image1,
    image2,
    image3,
  ];

  return (
    <div style={styles.container}>
      {/* 上半部分：静态图片 */}
      <div style={styles.topSection}>
        <img src={food} alt="Food" style={styles.image} />
        {/* 登录表单 */}
        <div style={styles.formContainer}>
          <h2>Login</h2>
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
          <button onClick={handleLogin} style={styles.button}>
            Login
          </button>
          <button onClick={() => navigate("/register")} style={styles.button}>
            Register
          </button>
        </div>
      </div>

      {/* 下半部分：图片轮播 */}
      <div style={styles.bottomSection}>
        <Carousel autoplay>
          {carouselImages.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Carousel ${index + 1}`} style={styles.carouselImage} />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column', // 垂直排列
    justifyContent: 'flex-start', // 从上到下排列
    alignItems: 'center',    // 水平居中
    height: '1500px',         // 容器高度为200px
    width: '100%',           // 容器宽度为100%
    position: 'relative',    // 用于定位表单
  },
  topSection: {
    width: '100%',
    height: '1000px',         // 上半部分高度为100px
    overflow: 'hidden',      // 防止图片溢出
    position: 'relative',    // 用于定位表单
  },
  image: {
    width: '100%',           // 图片宽度占满父容器
    height: '100%',          // 图片高度占满父容器
    objectFit: 'cover',      // 使图片覆盖整个区域
  },
  bottomSection: {
    width: '100%',
    height: '100px',         // 下半部分高度为100px
    textAlign: 'center',     // 水平居中
  },
  carouselImage: {
    height: '500px',         // 轮播图片高度为500px
    width: 'auto',           // 宽度自适应
    margin: '0 auto',        // 水平居中
  },
  formContainer: {
    position: 'absolute',    // 表单绝对定位
    top: '50%',              // 垂直居中
    left: '50%',             // 水平居中
    transform: 'translate(-50%, -50%)', // 居中偏移
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',    // 使表单内的内容居中
    padding: '20px',
    borderRadius: '8px',     // 圆角
    backgroundColor: 'white',// 背景色
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 阴影效果
    width: '300px',          // 设置表单宽度
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


export default Login;
