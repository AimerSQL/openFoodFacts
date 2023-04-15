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

  const chartData = data.map((item) => ({
    date: item.time_index,
    eco2: parseFloat(item.eco2),
    entityId: item.entity_id,
  }));

  const calculateStats = (data, entityId) => {
    const filteredData = data.filter((item) => item.entityId === entityId);
    const minValue = Math.min(...filteredData.map((item) => item.eco2));
    const maxValue = Math.max(...filteredData.map((item) => item.eco2));
    const avgValue = filteredData.reduce((acc, item) => acc + item.eco2, 0) / filteredData.length;
    return { minValue, maxValue, avgValue };
  };

  const nodo1Stats = calculateStats(chartData, 'nodo1');
  const nodo2Stats = calculateStats(chartData, 'nodo2');
  const nodo3Stats = calculateStats(chartData, 'nodo3');

  const config_1 = {
    data: chartData,
    xField: 'date',
    yField: 'eco2',
    seriesField: 'entityId',
    xAxis: {
      type: 'time',
    },
    slider: {
      start: 0.3,
      end: 0.5,
    },
    legend: {
      custom: true,
      items: [
        { id: 'nodo1', name: 'nodo1', value: 'nodo1', marker: { symbol: 'square', style: { fill: '#5AD8A6' } } },
        { id: 'nodo2', name: 'nodo2', value: 'nodo2', marker: { symbol: 'square', style: { fill: '#5D7092' } } },
        { id: 'nodo3', name: 'nodo3', value: 'nodo3', marker: { symbol: 'square', style: { fill: '#5B8FF9' } } },
      ],
    },
  };
  const config_2 = {
    data: chartData,
    xField: 'date',
    yField: 'eco2',
    xAxis: {
      type: 'time',
    },
    seriesField: 'entityId',
    legend: {
      custom: true,
      items: [
        { id: 'nodo1', name: 'nodo1', value: 'nodo1', marker: { symbol: 'square', style: { fill: '#5AD8A6' } } },
        { id: 'nodo2', name: 'nodo2', value: 'nodo2', marker: { symbol: 'square', style: { fill: '#5D7092' } } },
        { id: 'nodo3', name: 'nodo3', value: 'nodo3', marker: { symbol: 'square', style: { fill: '#5B8FF9' } } },
      ],
    },
  };
  return (
    <div
      style={{
        paddingTop: '20px',
      }}
    >
      <div class="text-center">
        <span class="text-style">eCo2: Dióxido de Carbono Equivalente</span>
      </div>
      <Line {...config_1} />
      <div
        style={{
          paddingTop: '20px',
        }}
      ></div>
      <Line {...config_2} />
    </div>
  );
};

export default GraficaEco2;