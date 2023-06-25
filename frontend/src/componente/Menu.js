import React, { useState, useEffect } from 'react';
import { Row, Col, Skeleton, Pagination, Spin } from 'antd';
import axios from 'axios';
import Products from './Products';
import Filtro from './Filtro';

const Menu = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingFiltered, setLoadingFiltered] = useState(false);
    
    const handleLoadingFiltered = (isLoaded) => {
        setLoadingFiltered(isLoaded);
      };
    

    const fetchData = async (page, limit) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:4000/products?page=${page}&limit=${limit}`);
            setTimeout(() => {
                setProductos(response.data);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData(currentPage, 12);
    }, [currentPage]);

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
            <Row>
                <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                    <div style={{ marginRight: '20px' }}>
                    <Filtro onLoading={handleLoadingFiltered}/>
                    </div>
                </Col>
                {loadingFiltered ? (<div style={{ marginTop: '-150px', marginLeft: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <Spin size="large" />
                    </div>):(
                <Products productos={productos.data} />)}
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