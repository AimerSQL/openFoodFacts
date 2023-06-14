import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import useJsonData from '../../service/UseJsonDataService';
import { Skeleton, DatePicker, Row, Col, Button } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

const Grafica = ({ dataType, title }) => {
    const data = useJsonData();
    const [dates, setDates] = useState([null, null]);

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

    const filteredData = data.filter(item => {
        const date = moment(item.time_index);
        return (!dates[0] || date.isSameOrAfter(dates[0])) && (!dates[1] || date.isSameOrBefore(dates[1]));
    });

    const chartData = filteredData.map((item, index) => {
        // 如果index小于10，则在控制台中打印当前的time_index值
        if (index <5) {
            console.log(item.time_index);
        }
        return {
            date: item.time_index,
            [dataType]: parseFloat(item[dataType]),
            entityId: item.entity_id,
        };
    });

    const config = {
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
    };

    return (
        <div
            style={{
                paddingTop: '10px',
            }}
        >
            <Row className="text-center">
                <span className="text-style">{title}</span>
            </Row>
            <Row justify="center" align="middle" style={{ height: '100%' }}>
                <Col>
                    <RangePicker 
                        showTime 
                        value={dates}
                        onCalendarChange={val => setDates(val)}
                    />
                </Col>
                <Col>
                    <Button/>
                </Col>
            </Row>
            <Line {...config} />
        </div>
    );
};

export default Grafica;