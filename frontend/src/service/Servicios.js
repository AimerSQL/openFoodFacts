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
    const response = await axios.post("http://localhost:4000/user", userdata);
    return response.data;
  };

  deleteProduct = async (productId) => {
    try {
      console.log('Sending delete request for productId:', productId);
      const response = await axios.delete(`http://localhost:4000/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error deleting product:', error);
    }
  };
  
  // deleteProductByBarcode = async (id) => {
  //   const response = await axios.delete(
  //     `http://localhost:4000/products/barcode/${id}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${this.token}`,
  //       },
  //     }
  //   );
  //   return response.data;
  // };
  
  
}


export default new Servicios();
