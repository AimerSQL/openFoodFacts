import React from 'react';
import { useLocation } from 'react-router-dom';
import Products from './Products';
import { Row, Col } from "antd";
import Filtro from './Filtro';

const FilteredProducts = () => {
    const location = useLocation();
    const data = location.state;
    
    return (
        <>
        <Row>
                <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                    <div style={{ marginRight: '20px' }}>
                        <Filtro />
                    </div>
                </Col>
            <Products productos={data.products} />
        </Row>
        </>
    );
};

export default FilteredProducts;
