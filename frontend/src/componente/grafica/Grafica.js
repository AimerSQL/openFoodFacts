import React, { useState, useEffect } from 'react';
import { Chart, Utils } from 'chart.js';
import { Line } from 'react-chartjs-2';
import useJsonData from '../../service/UseJsonDataService';
import { SearchOutlined } from '@ant-design/icons';
import { Skeleton, DatePicker, Row, Col, Button, Space } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;

const Grafica = ({ dataType, title }) => {
    const data = useJsonData();
    const [dates, setDates] = useState(null);
    const [value, setValue] = useState(null);
    const [chartData, setChartData] = useState(null);


    const [earliestDate, setEarliestDate] = useState(null);

    useEffect(() => {
        if (data) {
            const earliestData = data.reduce((prev, current) => {
                return (prev.time_index < current.time_index) ? prev : current;
            });

            setEarliestDate(moment(earliestData.time_index));
        }
    }, [data]);

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

/*     const chartData = data.map((item, index) => {
        // 如果index小于10，则在控制台中打印当前的time_index值
        if (index < 5) {
            console.log(item.time_index);
        }
        return {
            date: item.time_index,
            [dataType]: parseFloat(item[dataType]),
            entityId: item.entity_id,
        };
    }); */

/*     const config = {
        data: chartData,
        xField: 'date',
        yField: dataType,
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
    }; */      
    const DATA_COUNT = 7;
const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};
    const data1 = {
        labels: dataType,
        datasets: [
          {
            label: 'Dataset 1',
            data: [1,2,1,1,1,],
/*             borderColor: Utils.CHART_COLORS.red,
            backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5), */
            yAxisID: 'y',
          },
          {
            label: 'Dataset 2',
            data: [1,2,1,1,1,],
/*             borderColor: Utils.CHART_COLORS.blue,
            backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5), */
            yAxisID: 'y',
          }
        ]
      };
    const config = {
        type: 'line',
        data: data1,
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          stacked: false,
          plugins: {
            title: {
              display: true,
              text: 'Chart.js Line Chart - Multi Axis'
            }
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
            },
          }
        },
      };




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

/*     const fetchDataInRange = async (start, end) => {
        // Assuming that useJsonData() returns a function that fetches data
        const fetchedData = await useJsonData(start, end);
        setData(fetchedData);
    }; */

    const handleButtonClick = () => {
        if (value && value.length === 2) {
            const [start, end] = value;
            const startTimestamp = start.toDate().getTime();
            const endTimestamp = end.toDate().getTime();

            const data = {
                start: startTimestamp,
                end: endTimestamp
              };

            axios.post('http://localhost:4000/nodos', data)
            .then(response => {
             setChartData(response)
             console.log(chartData + "hola")
            })
            .catch(error => {
              console.log(error);
            });
        }
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
            <Line data={config.data} options={config.options} />
        </div>
    );
};

export default Grafica;