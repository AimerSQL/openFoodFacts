import React from 'react';
import { Line } from '@ant-design/charts';
import { Skeleton } from 'antd';
import useJsonData from '../../service/UseJsonDataService';


  const GraficaEco2 = () => {
  const data = useJsonData();

  if (!data) {
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

  const chartData = data.labels.map((label, index) => ({
    date: label,
    eco2: data.valuesEco2[index],
  }));

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'eco2',
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    slider: {
      start: 0,
      end: 1,
    },
    scrollbar: {
      type: 'horizontal',
    },
  };

  return (
    <div
      style={{
        paddingTop: '160px',

      }}
    >
      <Line {...config} />
    </div>
  );
};

export default GraficaEco2;