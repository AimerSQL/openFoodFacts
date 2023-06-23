import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Pagination } from "antd";
import Products from './Products';
import Filtro from './Filtro';
import Result404 from './Result404';

const FilteredProducts = () => {
    const location = useLocation();
    const data = location.state;
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    // 计算当前页应该显示的产品范围
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = data.products.slice(indexOfFirstProduct, indexOfLastProduct);

    // 处理页码改变事件
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    console.log(data.count)
    return (
        data.count !== 0 ? (
            <>
                <Row>
                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                        <div style={{ marginRight: '20px' }}>
                            <Filtro />
                        </div>
                    </Col>
                    <Products productos={currentProducts} />
                </Row>
                <Row>
                    <Col xs={24} sm={24} md={18} lg={18} xl={18} style={{ textAlign: 'center', marginTop: '20px', marginLeft: '25%' }}>
                        <Pagination
                            current={currentPage}
                            pageSize={productsPerPage}
                            total={data.products.length}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                            showQuickJumper={true}
                        />
                    </Col>
                </Row>
            </>
        ) : <>
            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <div style={{ marginRight: '20px' }}>
                        <Filtro />
                    </div>
                </Col>
                <Products productos={currentProducts} />

                <Col xs={12} sm={12} md={18} lg={18} xl={18}>
                    <Result404
                        subTitle={'NO SE HA ENCONTRADO NINGUN PRODUCTO'}

                    />
                </Col>
            </Row>
        </>
    );
};

export default FilteredProducts;
