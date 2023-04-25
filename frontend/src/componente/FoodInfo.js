import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function FoodInfo() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    getfood(id);
  }, [id]);

  const getfood = async (id) => {
    await axios.get(`http://localhost:4000/products/${id}`).then(response => {
      setProductos(response.data);
      setLoading(false);
    });
  };

  const handleFallbackImage = (e) => {
    e.target.src = 'https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1240w,f_auto,q_auto:best/rockcms/2022-03/plant-based-food-mc-220323-be3500.jpg';
  };
  const product = productos;
  const imgURL = !loading && product && product.img ? product.img : '';

  return (
    <>
      <Container>
        <Row className="mt-2">
          <Col>
            {!loading && (
              <img
                src={imgURL}
                onError={handleFallbackImage}
                className="rounded mx-auto d-block"
                alt=""
              />
            )}
          </Col>
          <Col>
            {product && (
              <>
                <Row className="mb-2"><p>id: {product._id}</p></Row>
                <Row className="mb-2"><p>Nombre: {product.product_name}</p></Row>
                <Row className="mb-2"><p>Categorías: {product.categories}</p></Row>
                <Row className="mb-2"><p>Marca: {product.brand}</p></Row>
                <Row className="mb-2"><p>Paises de venta: {product.country}</p></Row>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default FoodInfo;