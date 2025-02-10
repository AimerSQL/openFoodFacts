import React, { useState, useEffect } from 'react';
import { Row, Col, Skeleton, Pagination, Spin, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'; 
import Products from './Products';
import Filtro from './Filtro';
import Servicios from '../service/Servicios';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Menu = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingFiltered, setLoadingFiltered] = useState(false);
    const [initialPageLoaded, setInitialPageLoaded] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLoadingFiltered = (isLoaded) => {
        setLoadingFiltered(isLoaded);
    };
    
    useEffect(() => {
        const savedPage = localStorage.getItem('currentPage');
        if (savedPage) {
            setCurrentPage(Number(savedPage)); // 从 localStorage 读取页码
        } else {
            setCurrentPage(1); // 如果没有保存的页码，默认加载第一页
        }
        setInitialPageLoaded(true); // 标记初始页码已加载
    }, []);
    
    // useEffect(() => {
    //     const savedPage = localStorage.getItem('currentPage');
    //     console.log('Saved page from localStorage on load:', savedPage); // 输出 savedPage
    //     if (savedPage) {
    //         setCurrentPage(Number(savedPage)); // 从 localStorage 读取页码并设置为 currentPage
    //     }
    //     setInitialPageLoaded(true); // 加载完页码后标记为已加载
    // }, []); // 只在组件挂载时运行

    useEffect(() => {
        console.log('', initialPageLoaded)
        if (!initialPageLoaded) return;
        fetchData(currentPage, 12);
    }, [currentPage, initialPageLoaded]);

    const fetchData = async (page, limit) => {
        setLoading(true);
        Servicios.getProducts(page, limit).then(data => {
            setProductos(data);
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching data:', error);
        })
    };

    useEffect(() => {
        if (initialPageLoaded) {
            console.log('Saving page to localStorage:', currentPage); // 输出正在保存的页码
            localStorage.setItem('currentPage', currentPage);
        }
    }, [currentPage, initialPageLoaded]);
    

    useEffect(() => {
        console.log("useEffect called");
        const handlePopState = (e) => {
            console.log("111");
            const token = localStorage.getItem('token'); // 只检查 token 是否存在
            console.log("Token check:", token ? "Token exists" : "No token");
    
            if (!token) {
                navigate('/login'); // 如果没有 token，跳转到登录页
            } else {
                // 如果 token 存在，执行你的业务逻辑
                const previousPath = e.state?.from || '/';
                console.log("Previous path:", previousPath);
    
                if (previousPath === '/login') {
                    window.location.reload(); // 如果上一页是登录页，刷新页面
                } else {
                    navigate(-1); // 否则，返回上一页
                }
            }
        };
    
        // 监听 popstate 事件
        window.addEventListener('popstate', handlePopState);

        //window.history.pushState({ from: 'test' }, 'Test state', '/test');
    
        // 清理事件监听
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]); // 确保 navigate 作为依赖项传入
    
    

    const handleDelete = async (productId) => {
        try {
            Servicios.deleteProduct(productId)
            setProductos((prevProductos) => {
                const updatedData = prevProductos.data.filter(product => product._id !== productId);
                fetchData(currentPage, 12);
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
                        <Filtro onLoading={handleLoadingFiltered} />
                    </div>
                </Col>
                {loadingFiltered ? (<div style={{ marginTop: '-150px', marginLeft: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spin size="large" />
                </div>) : (
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