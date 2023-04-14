import React from 'react';
import { Line } from '@ant-design/charts';
import { Skeleton } from 'antd';
import useJsonData from '../../service/UseJsonDataService';


  const GraficaTvoc = () => {
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
    tvoc: data.valuesTvoc[index],
  }));

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'tvoc',
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

export default GraficaTvoc;