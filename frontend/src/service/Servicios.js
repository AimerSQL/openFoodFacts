import axios from 'axios'


class Servicios {
  getProducts = async (page, limit) => {
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

  getFoodRate = async (id) => {
    const response = await axios.get(`http://localhost:4000/rate-products/${id}`);
    return response.data;
  } 

  getNodos = async (date) => {
    const response = await axios.post('http://localhost:4000/nodos', date)
    return response.data;
  } 

  getFilteredProducts = async (filter) => {
    const response = await axios.post('http://localhost:4000/filtered-products', filter)
    return response.data;
  } 
}

export default new Servicios();