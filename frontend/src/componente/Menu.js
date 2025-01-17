import React, { useState, useEffect } from 'react';
 import { Row, Col, Skeleton, Pagination, Spin} from 'antd';
import Products from './Products';
import Filtro from './Filtro';
import Servicios from '../service/Servicios';

const Menu = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingFiltered, setLoadingFiltered] = useState(false);
    
    const handleLoadingFiltered = (isLoaded) => {
        setLoadingFiltered(isLoaded);
      };
    

    const fetchData = async (page, limit) => {
        setLoading(true);
        Servicios.getProducts(page,limit).then(data => {
            setProductos(data);
            setLoading(false);  
        }).catch((error) => {
            console.error('Error fetching data:', error);
        })
           
        
    };

    useEffect(() => {
        fetchData(currentPage, 12);
    }, [currentPage]);

    const handleDelete = async (productId) => {
        try {
            // 调用后端 API 删除产品
            await Servicios.deleteProduct(productId); 
    
            // 删除成功后更新前端状态
            setProductos((prevProductos) => {
                const updatedData = prevProductos.data.filter(product => product.id !== productId);
                return {
                    ...prevProductos,
                    data: updatedData,
                    totalCount: prevProductos.totalCount - 1,
                };
            });
        } catch (error) {
            console.error('Error deleting product:', error);
        }
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
                <Products productos={productos.data} onDelete={handleDelete} />)}
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