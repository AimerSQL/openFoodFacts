import React, { useState, useEffect } from 'react';
import { DatePicker, Row, Col, Button, Space, Table, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import './Grafica.css'

const { RangePicker } = DatePicker;

const Grafica = ({ dataType, title }) => {
  const [dates, setDates] = useState(null);
  const [value, setValue] = useState(null);
  const [nodoData, setNodoData] = useState();
  const [nodo1Data, setNodo1Data] = useState();
  const [nodo2Data, setNodo2Data] = useState();
  const [nodo3Data, setNodo3Data] = useState();

  const handleButtonClick = () => {
    if (value && value.length === 2) {
      const [start, end] = value;
      const startTimestamp = start.toDate().getTime();
      const endTimestamp = end.toDate().getTime();

      const requestData = {
        start: startTimestamp,
        end: endTimestamp,
      };

      axios
        .post('http://localhost:4000/nodos', requestData)
        .then((response) => {
          const sortedNodo1Data = response.data.nodo1.sort((a, b) => new Date(a.time_index) - new Date(b.time_index));
          const sortedNodo2Data = response.data.nodo2.sort((a, b) => new Date(a.time_index) - new Date(b.time_index));
          const sortedNodo3Data = response.data.nodo3.sort((a, b) => new Date(a.time_index) - new Date(b.time_index));

/*           setNodoData(response.data);
          setNodo1Data(response.data.nodo1);
          setNodo2Data(response.data.nodo2);
          setNodo3Data(response.data.nodo3); */
          setNodo1Data(sortedNodo1Data);
          setNodo2Data(sortedNodo2Data);
          setNodo3Data(sortedNodo3Data);

      
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  let chartData = [];
  let chartData1 = [];
  let chartData2 = [];
  let chartData3 = [];
  if (nodo1Data || nodo2Data || nodo3Data) {
/*     chartData = nodoData.map((item) => ({
      date: moment(item.time_index).format('YYYY-MM-DD HH:mm:ss'),
      [dataType]: parseFloat(item[dataType]),
      entityId: item.entity_id,
    })); */
    chartData1 = nodo1Data.map((item) => ({
      date: moment(item.time_index).format('YYYY-MM-DD HH:mm:ss'),
      [dataType]: parseFloat(item[dataType]),
      entityId: item.entity_id,
    }));
    chartData2 = nodo2Data.map((item) => ({
      date: moment(item.time_index).format('YYYY-MM-DD HH:mm:ss'),
      [dataType]: parseFloat(item[dataType]),
      entityId: item.entity_id,
    }));
    chartData3 = nodo3Data.map((item) => ({
      date: moment(item.time_index).format('YYYY-MM-DD HH:mm:ss'),
      [dataType]: parseFloat(item[dataType]),
      entityId: item.entity_id,
    }));
  }

  const getOption = () => {
    return {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Nodo 1', 'Nodo 2', 'Nodo 3']
      },
      xAxis: {
        data: chartData1.map(item => item.date),
        type: 'category'
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'Nodo 1',
        data: chartData1.map(item => item[dataType]),
        type: 'line',
        step: 'start',
        itemStyle: {
          opacity: 0,
        },
        smooth: true
      },
      {
        name: 'Nodo 2',
        data: chartData2.map(item => item[dataType]),
        type: 'line',
        step: 'start',
        itemStyle: {
          opacity: 0,
        },
        smooth: true
      },
      {
        name: 'Nodo 3',
        data: chartData3.map(item => item[dataType]),
        type: 'line',
        step: 'start',
        itemStyle: {
          opacity: 0,
        },
        smooth: true
      }
    ]
    }
  }

  const columns = [
    {
      title: 'Nodos',
      dataIndex: 'nodos',
      key: 'nodos',
    },
    {
      title: 'Numero de datos',
      dataIndex: 'numero',
      key: 'numero',
    },
    {
      title: 'Max',
      dataIndex: 'max',
      key: 'max',
    },
    {
      title: 'Min',
      dataIndex: 'min',
      key: 'min',
    },
    {
      title: 'Mean',
      dataIndex: 'mean',
      key: 'mean',
    },

  ];

  return (
    <div>
      <Row className="text-center" style={{ marginBottom: '20px' }}>
        <span className="text-style">{title}</span>
      </Row>
      <Row justify="center" align="middle" style={{ height: '100%', marginBottom: '20px' }}>
        <Space size="middle">
          <Col>
            <RangePicker
              showTime
              value={value}
              onChange={(val) => {
                setValue(val);
              }}
            />
          </Col>
          <Col>
            <Button
              type="primary"
              shape="circle"
              icon={<SearchOutlined />}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={handleButtonClick}
            />
          </Col>
        </Space>
      </Row>
      <ReactEcharts option={getOption()} />
      <Table columns={columns}/>
    </div>
  );
};

export default Grafica;