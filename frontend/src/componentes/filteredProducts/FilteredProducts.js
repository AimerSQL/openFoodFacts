import { useLocation } from 'react-router-dom';
import { Row, Col, Pagination, Spin } from "antd";
import Products from '../products/Products';
import Filtro from '../filtro/Filtro';
import Result404 from '../Result404';
import Servicios from "../Servicios";
import React, { useState, useEffect } from "react";
const FilteredProducts = () => {
    
    const productsPerPage = 12;
    const location = useLocation();
    const data = location.state;
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingFiltered, setLoadingFiltered] = useState(false);
    const [favorites, setFavorites] = useState([]);
    
    const { favoritos } = location.state || {};

    const handleLoadingFiltered = (isLoaded) => {
        setLoadingFiltered(isLoaded); // 设置 dataLoaded 状态
      };
    // 计算当前页应该显示的产品范围
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = data.products.slice(indexOfFirstProduct, indexOfLastProduct);

    // 处理页码改变事件
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        Servicios.getProductsByUser().then((data) => {
          const productIds = data.map((item) => item.product_id);
          setFavorites(productIds);
        });
        if (Array.isArray(favoritos)) {
          const productIds = favoritos.map((item) => item.product_id);
          setFavorites(productIds);
        }
    }, [favoritos]);

    return (
        data.count !== 0 ? (
            <>
                <Row>
                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                        <div style={{ marginRight: '20px' }}>
                            <Filtro onLoading={handleLoadingFiltered}/>
                        </div>
                    </Col>
                    {loadingFiltered ? (<div style={{ marginTop: '-150px', marginLeft: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <Spin size="large" />
                    </div>):(
                    <Products productos={currentProducts} favorites={favorites} />)}
                </Row>
                <Row>
                    <Col xs={18} sm={18} md={18} lg={18} xl={18} style={{ textAlign: 'center', marginTop: '20px', marginLeft: '25%' }}>
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
                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                    <div style={{ marginRight: '20px' }}>
                        <Filtro />
                    </div>
                </Col>
                <Products productos={currentProducts} favorites={favorites}/>
            </Row>
            <Row>
                <Col xs={18} sm={18} md={18} lg={18} xl={18} style={{ textAlign: 'center', marginTop: '-30%', marginLeft: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Result404
                        subTitle={'No se ha encontrado ningún producto'}/>
                </Col>
            </Row>
        </>
    );
};

export default FilteredProducts;
