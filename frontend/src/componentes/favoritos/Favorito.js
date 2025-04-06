import React, { useState, useEffect, useRef } from 'react';
import { Skeleton, Card, Button } from 'antd';
import Servicios from '../Servicios';

const Collection = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); // 用来判断是否还有数据
    const loaderRef = useRef(null);

    const fetchProductDetails = async (productIds) => {
        // 获取所有产品的详细信息
        try {
            const productsData = await Servicios.getProducts(productIds);  // 假设你可以传递一个数组的 product_id
            return productsData;
        } catch (error) {
            console.error('Error fetching product details:', error);
            return [];
        }
    };

    const fetchData = async (page) => {
        setLoading(true);  // 开始加载数据
        try {
            // 获取用户收藏的 product_id
            const favoritos = await Servicios.getFavoritos(page, 10); // 请求收藏列表
            
            console.log("Fetched favoritos:", favoritos);  // 查看接收到的数据结构
            setProductos(favoritos);
            console.log("tutu",productos[1].url);
            setLoading(false);  // 数据加载完毕
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);  // 错误处理完毕
        }
    };

    // 使用 IntersectionObserver 实现滚动监听
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

    // 初始加载数据
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
        <div>
            <div className="products-list">
                {productos.map((producto, index) => (
                    <Card
                    key={producto._id} // 使用 _id 作为 key
                    title={producto.title} // 显示产品的标题
                    style={{ marginBottom: '16px' }}
                  >
                    {/* 渲染产品的详细信息 */}
                    <p>{producto.product_name}</p>
                    <img
                      alt="example"
                      src={producto.image_url}  
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Card>
                ))}
                
            </div>

            {loading && <div>Loading...</div>}

            {/* 加载更多的触发器 */}
            {hasMore && (
                <div ref={loaderRef} style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Button loading={loading} type="primary">
                        加载更多
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Collection;

