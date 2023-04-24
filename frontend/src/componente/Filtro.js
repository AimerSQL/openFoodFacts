import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import './Filtro.css';
import axios from 'axios';
import CircularJSON from 'circular-json';

const FilterForm = ({ onFilterSubmit }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState('');
  const [brands, setBrands] = useState('');
  const [countries, setCountries] = useState('');

  const handleSubmit = () => {
    const data = {
      categories: 'some category',
      brand: 'some brand',
      countries: 'some countries'
    };

    const dataString = CircularJSON.stringify(data);
    axios.post('/api/filtered-products', dataString, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        onFilterSubmit(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Card title="筛选器" bordered={true} className="filter-form-card">
      <Form layout="vertical" form={form}>
        <Form.Item label="Categorías" name="categories" className="form-item">
          <Input
            placeholder="Basic usage"
            onChange={(value) => setCategories(value)}
          />
        </Form.Item>

        <Form.Item label="Marca" name="brand" className="form-item">
          <Input
            placeholder="Basic usage"
            onChange={(value) => setBrands(value)}
          />
        </Form.Item>

        <Form.Item label="Paises de venta" name="countries" className="form-item">
          <Input
            placeholder="Basic usage"
            onChange={(value) => setCountries(value)}
          />
        </Form.Item>

        <Form.Item className="form-item">
          <Button type="primary" onClick={handleSubmit}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FilterForm;