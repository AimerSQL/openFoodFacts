import axios from 'axios'


class Servicios {
  getProductos = async (page, limit) => {
    const response = await axios.get(`http://localhost:4000/products?page=${page}&limit=${limit}`);
    return response.data;
  } 

  getFoodInfoById = async (id,productName) => {
    const response = await axios.get(`http://localhost:4000/products/${id}?productName=${encodeURIComponent(productName)}`);
    return response.data;
  } 

  getFoodInfoByBarcode = async (id) => {
    const response = await axios.get(`http://localhost:4000/products/barcode/${id}`);
    return response.data;
  } 

}

export default new Servicios();