import { useState, useEffect, useRef } from 'react';
import { Skeleton, Row, Col, Card, Button, Spin } from 'antd';
import Servicios from '../Servicios';
import noImage from "../../fotos/no_image.png"; 
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const Favoritos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);
    const { t } = useTranslation();

    const fetchData = async (page) => {
        setLoading(true);
        try {
            const favoritos = await Servicios.getFavoritos(page, 10);
            setProductos(favoritos);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!hasMore) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage(prevPage => {
                    const nextPage = prevPage + 1;
                    fetchData(nextPage);
                    return nextPage;
                });
            }
        }, { threshold: 1.0 });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [hasMore]);

    useEffect(() => {
        fetchData(page);
    }, [page]);

    if (loading && page === 1) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
                <Skeleton active paragraph={{ rows: 6 }} />
            </div>
        );
    }

   return (
  <div style={{ padding: "24px" }}>
    <h1 style={{ textAlign: "center", marginBottom: "24px" }}>{t("Mis Favoritos") }</h1>

    {loading && (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Spin size="large" />
      </div>
    )}

    <Row gutter={[16, 16]}>
      {productos.map((p) => (
        <Col key={p._id} xs={24} sm={12} md={8} lg={6}>
          <Link
            to={`/foodInfo/${p._id}?productName=${encodeURIComponent(p.product_name)}`}
            style={{ textDecoration: "none" }}
          >
            <Card
              hoverable
              title={p.title}
              cover={
                <img
                  alt={p.product_name}
                  src={p.image_url || noImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = noImage;
                  }}
                  style={{
                    height: 200,
                    objectFit: "contain",
                    padding: "12px",
                  }}
                />
              }
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >

              <p style={{ fontWeight: "bold", color: "black" }}>
                {p.product_name}
              </p>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>

    {hasMore && (
      <div ref={loaderRef} style={{ textAlign: "center", padding: "24px 0" }}>
        <Button loading={loading} type="primary">
          {t("Cargar más")}
        </Button>
      </div>
    )}
  </div>
);
};

export default Favoritos;

