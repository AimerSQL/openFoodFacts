import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import useJsonData from '../../service/UseJsonDataService';
import { SearchOutlined } from '@ant-design/icons';
import { Skeleton, DatePicker, Row, Col, Button, Space } from 'antd';
import './Grafica.css';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;

const Grafica = ({ dataType, title }) => {
  //const data = useJsonData();
  //const data = response.data.nodo1;
  const [dates, setDates] = useState(null);
  const [value, setValue] = useState(null);
  const [nodo1Data, setNodo1Data] = useState(null);
  const [nodo2Data, setNodo2Data] = useState(null);
  const [nodo3Data, setNodo3Data] = useState(null);
  const [data1, setData1] = useState(null);

  

/*   useEffect(() => {
    if (nodo1Data && nodo2Data) {
      const chartData = {
        labels: ['1', '2', '3', '4', '5', '6'], // 示例标签数据，请根据实际情况修改
        datasets: [
          {
            label: 'nodo1',
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 1,
            data: nodo1Data,
          },
          {
            label: 'nodo2',
            backgroundColor: 'rgba(75,255,255,1)',
            borderColor: 'rgba(0,0,255,1)',
            borderWidth: 1,
            data: nodo2Data,
          },
        ],
      };
      setData1(chartData);
    }
  }, [nodo1Data, nodo2Data]); */

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

  const disabledDate = (current) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') >= 7;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') >= 7;
    return !!tooEarly || !!tooLate;
  };

  const onOpenChange = (open) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

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
          setNodo1Data(response.data.nodo1);
          setNodo2Data(response.data.nodo2);
          setNodo3Data(response.data.nodo3);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const data = nodo1Data;
  let chartData = [];
  if (data) {
    chartData = data.map((item) => ({
      date: item.time_index,
      [dataType]: parseFloat(item[dataType]),
      entityId: item.entity_id,
    }));
  }

  const config = {
    data: chartData,
    xField: 'date',
    yField: dataType,
    seriesField: 'entityId',
    xAxis: {
        type: 'time',
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

  return (
    <div
      style={{
        paddingTop: '10px',
      }}
    >
      <Row className="text-center" style={{ marginBottom: '20px' }}>
        <span className="text-style">{title}</span>
      </Row>
      <Row justify="center" align="middle" style={{ height: '100%', marginBottom: '20px' }}>
        <Space size="middle">
          <Col>
            <RangePicker
              showTime
              value={dates || value}
              disabledDate={disabledDate}
              onCalendarChange={(val) => {
                setDates(val);
              }}
              onChange={(val) => {
                setValue(val);
              }}
              onOpenChange={onOpenChange}
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
{/*       <div>
        {data1 && (
          <Line
            data={data1}
            options={{
              title: {
                display: true,
                text: 'Gráfica de datos',
                fontSize: 20,
              },
              legend: {
                display: true,
                position: 'right',
              },
            }}
          />
        )}
      </div> */}
      <Line {...config} />
    </div>
  );
};

export default Grafica;
