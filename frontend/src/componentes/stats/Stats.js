import React, { useEffect } from "react";
import { Row, Col, Card } from "antd";
import Servicios from "../Servicios";

function Products() {
  useEffect(() => {
    Servicios.getProductsStatics().then((data) => {
     console.log("stats:",data)
    }); 
  });

    return (
        <div style={{ padding: "20px" }}>
            <h1>Estadisticas de Productos</h1>
            <Row gutter={16}>
                <Col span={24}>
                    <Card title="Estadisticas Generales" bordered={false}>
                        <p>Estadisticas de productos</p>
                    </Card>
                </Col>
            </Row>
        </div>

    );
};

export default Products;

