import axios from "axios";

class Servicios {
  token = localStorage.getItem("token");
  
  getProducts = async (page, limit) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:4000/products?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  getFavoritos = async () => {
    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:4000/favoritos/${user_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  getFoodInfoById = async (id, productName) => {
    const response = await axios.get(
      `http://localhost:4000/products/${id}?productName=${encodeURIComponent(
        productName
      )}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    return response.data;
  };

  getFoodInfoByBarcode = async (id) => {
    const response = await axios.get(
      `http://localhost:4000/products/barcode/${id}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    return response.data;
  };

  getProductsByUser = async () => {
    const user_id = localStorage.getItem("user_id"); // 从 localStorage 获取 user_id
    console.log("yonghu",user_id);
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:4000/favoritoByUser/${user_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  getFoodRate = async (id) => {
    const response = await axios.get(
      `http://localhost:4000/rate-products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    return response.data;
  };

  getNodos = async (date) => {
    const response = await axios.post("http://localhost:4000/nodos", date, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response.data;
  };

  getFilteredProducts = async (filter) => {
    const response = await axios.post(
      "http://localhost:4000/filtered-products",
      filter,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    return response.data;
  };

  getUserCredentical = async (userdata) => {
    try {
    const response = await axios.post("http://localhost:4000/user", userdata);
    return response.data;
  }catch(error){
    alert("Contraseña o nombre de usuario incorrecto.");
  }
  };

  deleteProduct = async (productId) => {
      console.log('Sending delete request for productId:', productId);
      const response = await axios.delete(`http://localhost:4000/products/${productId}`);
      return response.data;
 
  };
  userRegister = async (userdata) => {
    const response = await axios.post("http://localhost:4000/register", userdata, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response.data;
  };
  addToFavorito = async ( product_id) => {
    const user_id = localStorage.getItem("user_id");
    try {
      const response = await axios.post('http://localhost:4000/favorito', {
        product_id,
        user_id,
      });
      return response.data; // 返回后端响应的数据
    } catch (error) {
      console.error('Error adding to favorito:', error);
      throw error; // 抛出错误以供调用方处理
    }
  };

    removeFromFavorito = async (product_id) => {
      const user_id = localStorage.getItem("user_id");
      const productId = product_id;
      console.log("mqw",product_id);
      const response = await axios.delete(`http://localhost:4000/favorito/${user_id}/${productId}`);
      return response.data;
    };

}
  
 
export default new Servicios();
