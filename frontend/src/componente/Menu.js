import React, { useState, useEffect } from 'react';
import { Row, Col, Skeleton, Pagination } from 'antd';
import axios from 'axios';
import Products from './Products';
import Filtro from './Filtro';
import Servicios from '../service/Servicios';

const Menu = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchData = async (page, limit) => {
        setLoading(true);
        Servicios.getProductos(page,limit).then(data => {
            setProductos(data);
            setLoading(false);  
        }).catch((error) => {
            console.error('Error fetching data:', error);
        })
           
        
    };

    useEffect(() => {
        fetchData(currentPage, 12);
    }, [currentPage]);

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
            <Row>
                <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                    <div style={{ marginRight: '20px' }}>
                        <Filtro />
                    </div>
                </Col>
                <Products productos={productos.data} />
            </Row>


            <Row>
                <Col xs={24} sm={24} md={18} lg={18} xl={18} style={{ textAlign: 'center', marginTop: '20px', marginLeft: '25%' }}>
                    <Pagination
                        current={currentPage}
                        onChange={(page) => setCurrentPage(page)}
                        total={productos.totalCount}
                        showSizeChanger={false}
                        defaultPageSize={12}
                        showQuickJumper={true}
                    />
                </Col>
            </Row>



        </>
    );
};

export default Menu;