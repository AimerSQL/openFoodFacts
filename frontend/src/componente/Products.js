import { useState } from "react";
import { Row, Col, Card, Pagination } from "antd";
import { Link } from "react-router-dom";


function Products({ productos }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [hoveredCard, setHoveredCard] = useState(null);


    const handleMouseEnter = (id) => {
        setHoveredCard(id);
    };

    const handleMouseLeave = () => {
        setHoveredCard(null);
    };
    return (

        <Col xs={24} sm={24} md={18} lg={18} xl={18}>
            <Row gutter={[16, 16]}>
                {productos.map((p) => (
                    <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                        <Link
                            to={`/foodInfo/${p._id}`}
                            style={{
                                textDecoration: "none",
                            }}
                        >
                            <Card
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderWidth: "5px",
                                    borderColor:
                                        hoveredCard === p._id ? "#001529" : "#91d5ff",
                                    borderStyle: "solid",
                                }}
                                onMouseEnter={() => handleMouseEnter(p._id)}
                                onMouseLeave={handleMouseLeave}
                                cover={
                                    <div
                                        style={{
                                            height: "160px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            paddingTop: "20px",
                                        }}
                                    >
                                        {p.image_url ? (
                                            <img
                                                alt="example"
                                                src={p.image_url}
                                                style={{
                                                    maxHeight: "100%",
                                                    maxWidth: "100%",
                                                    objectFit: "contain",
                                                }}
                                            />
                                        ) : (
                                            <img
                                                alt="example"
                                                src="https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1240w,f_auto,q_auto:best/rockcms/2022-03/plant-based-food-mc-220323-be3500.jpg"
                                                style={{
                                                    maxHeight: "100%",
                                                    maxWidth: "100%",
                                                    objectFit: "contain",
                                                }}
                                            />
                                        )}
                                    </div>
                                }
                            >
                                <Card.Meta
                                    title={
                                        p.product_name ? (
                                            p.product_name
                                        ) : (
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    color: "red",
                                                }}
                                            >
                                                ¡Nombre No Disponible!
                                            </span>
                                        )
                                    }
                                    style={{
                                        textAlign: "center",
                                        color: "#F0F2F5",
                                    }}
                                />
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
            {/* <Row>
                <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 24 }}
                    xl={{ span: 24 }}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                    }}
                >
                   
                </Col>
            </Row> */}
        </Col>

    );
};

export default Products;

