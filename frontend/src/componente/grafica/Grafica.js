import React, { useState, useEffect } from 'react';
import { DatePicker, Row, Col, Button, Space, Table, Spin, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment'
import dayjs from 'dayjs';
import ReactEcharts from 'echarts-for-react';
import './Grafica.css'
import Result404 from '../Result404';

const { RangePicker } = DatePicker;


const Grafica = ({ dataType, title }) => {
  const [dates, setDates] = useState([dayjs('2021-08-01 18:00:00'), dayjs('2021-08-01 18:00:00').add(2, 'months')]);
  const [value, setValue] = useState([
    dayjs('2021-08-01 18:00:00'),
    dayjs('2021-08-01 19:00:00')
  ]);
  const [nodoData, setNodoData] = useState();
  const [nodo1Data, setNodo1Data] = useState();
  const [nodo2Data, setNodo2Data] = useState();
  const [nodo3Data, setNodo3Data] = useState();
  const [dataStat, setDataStat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleButtonClick();
  }, [value, dataType]);

  const disabledDate = (current) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], "months") >= 2;
    const tooEarly = dates[1] && dates[1].diff(current, "months") >= 2;
    return !!tooEarly || !!tooLate;
  };

  const handleButtonClick = () => {
    if (value && value.length === 2) {
      setLoading(true);
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
          console.log(response.data)
          if (response.data) {
            const sortedNodo1Data = response.data.nodos.nodo1.sort((a, b) => new Date(a.time_index) - new Date(b.time_index));
            const sortedNodo2Data = response.data.nodos.nodo2.sort((a, b) => new Date(a.time_index) - new Date(b.time_index));
            const sortedNodo3Data = response.data.nodos.nodo3.sort((a, b) => new Date(a.time_index) - new Date(b.time_index));
            const { avg, maxMin } = response.data;
            const dataStatBack = Object.keys(maxMin).map((key, index) => {
              return {
                key: index,
                nodos: 'Nodo' + ' ' + (Number(key) + 1),
                max: maxMin[key].maxNodo[dataType],
                min: maxMin[key].minNodo[dataType],
                mean: avg[index][dataType]
              };
            });

            setDataStat(dataStatBack);
            setNodo1Data(sortedNodo1Data);
            setNodo2Data(sortedNodo2Data);
            setNodo3Data(sortedNodo3Data);
          } else {
            // No data or invalid data, reset the states
            setDataStat([]);
            setNodo1Data(null);
            setNodo2Data(null);
            setNodo3Data(null);
          }

          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setDataStat([]);
          setNodo1Data(null);
          setNodo2Data(null);
          setNodo3Data(null);
          setLoading(false);
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

  const dataTypeToUnit = {
    humedad: '%H',
    temperatura: '°C',
    eco2: 'ppm',
    tvoc: 'ppm'
  };

  const titleToTooltip = {
    'Humedad': 'Humedad',
    'Temperatura': 'Temperatura',
    'Eco2': 'Dióxido de Carbono Equivalente',
    'Tvoc': 'Total de Compuestos Orgánicos Volátiles'
  };

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
        type: 'value',
        axisLabel: {
          formatter: (value) => {
            return `${value} ${dataTypeToUnit[dataType]}`;
          },
        },
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
      align: 'center',
      width: 100,
    },
    {
      title: 'Max',
      dataIndex: 'max',
      key: 'max',
      align: 'center',
      width: 100,
      render: max => `${max} ${dataTypeToUnit[dataType]}`,
    },
    {
      title: 'Min',
      dataIndex: 'min',
      key: 'min',
      align: 'center',
      width: 100,
      render: min => `${min} ${dataTypeToUnit[dataType]}`,
    },
    {
      title: 'Mean',
      dataIndex: 'mean',
      key: 'mean',
      align: 'center',
      width: 100,
      render: mean => `${mean} ${dataTypeToUnit[dataType]}`,
    },

  ];

  return (
    <div>
      <Row className="text-center" style={{ marginBottom: '20px' }}>
        <Tooltip placement="right" color= "blue" title={titleToTooltip[title]}>
          <span className="text-style">{title}</span>
        </Tooltip>
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
              onCalendarChange={(val) => {
                setDates(val);
              }}
              disabledDate={disabledDate}

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
              showOk={false}
            />
          </Col>
        </Space>
      </Row>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', height: '300px', alignItems: 'center' }}>
          <Spin size="large" />
        </div>
      ) : (
        nodo1Data || nodo2Data || nodo3Data ? (
          <ReactEcharts option={getOption()} />
        ) : (
          <Result404
            subTitle={'No hay datos entre ese rango! Por favor, seleccione una franja horaria entre el 2021-07-20 y el 2022-01-01 .'}
          />
        )
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', height: '300px', alignItems: 'center' }}>
          <Spin size="large" />
        </div>
      ) : (
        dataStat && dataStat.length > 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Table columns={columns} dataSource={dataStat} pagination={false} bordered={true} style={{ width: '85%' }} />
          </div>
        ) : (
          <span

          />
        )
      )}
    </div>
  );
};

export default Grafica;