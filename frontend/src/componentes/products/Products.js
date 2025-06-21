import { useState } from "react";
import { Row, Col, Card,Button } from "antd";
import { Link } from "react-router-dom";
import { DeleteOutlined,StarOutlined, StarFilled } from '@ant-design/icons';
import noImage from "../../fotos/no_image.png"; 
import { useTranslation } from "react-i18next";

function Products({ productos ,onDelete ,favorites, onToggleFavorite}) {
    const [hoveredCard, setHoveredCard] = useState(null);
    const { t } = useTranslation();

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
                            to={`/foodInfo/${p._id}?productName=${encodeURIComponent(p.product_name)}`}
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
                                                src={p.image_url || noImage}
                                                onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = noImage;
                                                }}
                                                style={{
                                                maxHeight: "100%",
                                                maxWidth: "100%",
                                                objectFit: "contain",
                                                }}
                                            />
                                        ) : (
                                            <img
                                                alt="example"
                                                src={noImage}
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
                                                {t("¡Nombre No Disponible!")}
                                            </span>
                                        )
                                    }
                                    style={{
                                        textAlign: "center",
                                        color: "#F0F2F5",
                                    }}
                                />
                                {localStorage.getItem("role") === "admin" && (<Button
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onDelete(p._id);
                                    }}
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        color: "red",
                                    }}
                                />
                                )}
                                <Button
                                    type="text"
                                    icon={favorites.includes(p._id) ? <StarFilled /> : <StarOutlined />}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onToggleFavorite(p._id);
                                    }}
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        left: "10px",
                                        color: "#f7b500",
                                    }}
                                />
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Col>

    );
};

export default Products;

