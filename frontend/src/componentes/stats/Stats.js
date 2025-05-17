import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spin } from "antd";
import { Pie } from "@ant-design/plots";
import Servicios from "../Servicios";

function Products() {
  const [loading, setLoading] = useState(true);
  const [nutriscoreData, setNutriscoreData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [brandData, setBrandData] = useState([]);

  useEffect(() => {
    Servicios.getProductsStatics().then((data) => {
      const formatData = (arr, label) =>
        arr.map((item) => ({
          name: item[label] || "No definido",
          count: item.count,
          ratio: item.ratio,
        }));

      setNutriscoreData(formatData(data.nutriscoreRatio, "nutriscore_grade"));
      setCategoryData(formatData(data.categoryRatio, "category"));
      setBrandData(formatData(data.brandRatio, "brand"));

      setLoading(false);
    });
  }, []);

  const getChartConfig = (data, title) => ({
    data,
    angleField: "ratio",
    colorField: "name",
    radius: 1,
    innerRadius: 0.4,
    statistic: false,
    label: {
      type: "spider",
      content: "{name} ({percentage})",
    },
    interactions: [{ type: "element-active" }],
    legend: {
      position: "right",
    },
    tooltip: {
      fields: ["name", "count", "ratio"],
      formatter: (datum) => ({
        name: datum.name,
        value: `${(datum.ratio * 100).toFixed(2)}% (${datum.count} items)`,
      }),
    },
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Estadísticas de Productos</h1>
      {loading ? (
        <Spin />
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card title="Distribución Nutriscore" bordered={false}>
              <Pie {...getChartConfig(nutriscoreData, "Nutriscore")} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Distribución por Categoría" bordered={false}>
              <Pie {...getChartConfig(categoryData, "Categoría")} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Distribución por Marca" bordered={false}>
              <Pie {...getChartConfig(brandData, "Marca")} />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default Products;
