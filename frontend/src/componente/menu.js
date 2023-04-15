import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Skeleton } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

const List = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/food');
        setTimeout(() => {
          setProductos(response.data);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleMouseEnter = (id) => {
    setHoveredCard(id);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };


  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          paddingTop: '20px',
        }}
      >
        <Skeleton active paragraph={{ rows: 6 }} />
        <Skeleton active paragraph={{ rows: 6 }} />
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        {productos.map((p) => (
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Link to={`/foodInfo/${p.id}`}>
              <Card
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: hoveredCard === p.id ? 'rgba(0, 21, 41, 0.6)' : 'rgba(24, 144, 255, 0.6)',
                }}
                onMouseEnter={() => handleMouseEnter(p.id)}
                onMouseLeave={handleMouseLeave}
                cover={
                  <div
                    style={{
                      height: '160px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingTop: '20px',
                    }}
                  >
                    {p.img ? (
                      <img
                        alt="example"
                        src={p.img}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <img
                        alt="example"
                        src="https://images.openfoodfacts.org/images/products/841/036/802/7731/front_fr.12.400.jpg"
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    )}
                  </div>
                }
              >
                <Card.Meta
                  title={p.product_name}
                  style={{ textAlign: 'center', color: '#F0F2F5' }}
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default List;