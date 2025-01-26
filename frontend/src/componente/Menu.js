import React, { useState, useEffect } from 'react';
 import { Row, Col, Skeleton, Pagination, Spin} from 'antd';
import Products from './Products';
import Filtro from './Filtro';
import Servicios from '../service/Servicios';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'

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
        console.log('Saved page from localStorage on load:', savedPage); // 输出 savedPage
        if (savedPage) {
            setCurrentPage(Number(savedPage)); // 从 localStorage 读取页码并设置为 currentPage
        }
        setInitialPageLoaded(true); // 加载完页码后标记为已加载
    }, []); // 只在组件挂载时运行

    useEffect(() => {
        console.log('',initialPageLoaded)
        if (!initialPageLoaded) return; 
        fetchData(currentPage, 12); 
    }, [currentPage, initialPageLoaded]);

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
        if (initialPageLoaded) {
            console.log('Saving page to localStorage:', currentPage); // 输出正在保存的页码
            localStorage.setItem('currentPage', currentPage);
        }
    }, [currentPage, initialPageLoaded]);

    useEffect(() => {
        if (location.pathname === '/menu') {
            // 判断当前历史记录的状态是否为空，防止重复替换
            if (window.history.state === null) {
              // 通过 replaceState 来替换当前历史记录，确保点击后退按钮时不会返回到 /login
              window.history.replaceState({}, '', '/menu');
            }
        }
    
        const handlePopState = (e) => {
          if (location.pathname === '/login') {
            // 如果用户试图通过后退按钮回到登录页面，强制跳转到菜单页面
            navigate('/menu');
          }
        };
    
        // 监听后退操作
        window.addEventListener('popstate', handlePopState);
    
        // 清理事件监听
        return () => {
          window.removeEventListener('popstate', handlePopState);
        };
      }, [location, navigate]);


    //   const token = localStorage.getItem("token");
    //   const handleDelete = async (id) => {
    //     try {
    //         // 直接发送删除请求
    //         await axios.delete(`http://localhost:4000/products/barcode/${id}`, {
    //           headers: {
    //             Authorization: `Bearer ${token}`,  // 如果需要 token，可以保留
    //           },
    //         });
        
    //         setLoading(false);
    //         setProductos([]);  // 删除后清空产品列表，或者根据需求更新UI
    //         console.log('Product deleted successfully');
    //       } catch (error) {
    //         console.log('Error deleting product', error);
    //         setLoading(false);
    //       }
    //   };
      

    const handleDelete = async (productId) => {
        try {
            console.log("Deleting product with ID:", productId);
            await axios.delete(`http://localhost:4000/products/${productId}`);
    
            // 删除成功后更新前端状态
            setProductos((prevProductos) => {
                const updatedData = prevProductos.data.filter(product => product._id !== productId);
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