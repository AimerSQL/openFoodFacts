import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spin } from "antd";
import { Pie } from "@ant-design/plots";
import Servicios from "../Servicios";

function Products() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Servicios.getProductsStatics().then((data) => {
      const formatted = data.nutriscoreRatio.map((item) => ({
        nutriscore_grade: item.nutriscore_grade || "No definido",
        count: item.count,
        ratio: item.ratio,
      }));
      setChartData(formatted);

      setLoading(false);
    });
  }, []);

const config = {
  data: chartData,
  angleField: "ratio",
  colorField: "nutriscore_grade",
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
    fields: ["nutriscore_grade", "count", "ratio"],
    formatter: (datum) => ({
      name: datum.nutriscore_grade,
      value: `${(datum.ratio * 100).toFixed(2)}% (${datum.count} items)`,
    }),
  },
};


  return (
    <div style={{ padding: "20px" }}>
      <h1>Estadísticas de Productos</h1>
      <Row gutter={16}>
        <Col span={24}>
          <Card title="Distribución Nutriscore" bordered={false}>
            {loading ? <Spin /> : <Pie {...config} />}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Products;
