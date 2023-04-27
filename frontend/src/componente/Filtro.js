import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import './Filtro.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';


const FilterForm = ({ onFilterSubmit }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();


  const handleSubmit = () => {
    const isEmpty = Object.values(form.getFieldsValue()).every((value) => !value);
    if (!isEmpty) {
      const categoriesValue = form.getFieldValue("categories");
      const brandsValue = form.getFieldValue("brands");
      const countriesValue = form.getFieldValue("countries");
      const data = {
        categories: categoriesValue,
        brands: brandsValue,
        countries: countriesValue,
      };

      axios.post('http://localhost:4000/filtered-products', data)
        .then(response => {
          navigate('/filtered-products', { state: response.data });
        })
        .catch(error => {
          console.log(error);
        });
    }

  };

  return (
    <Card title="Filtro" bordered={true} className="filter-form-card">
      <Form layout="vertical" form={form}>
        <Form.Item label="Categorías" name="categories" className="form-item">
          <Input placeholder="Basic usage" />
        </Form.Item>

        <Form.Item label="Marca" name="brands" className="form-item">
          <Input placeholder="Basic usage" />
        </Form.Item>

        <Form.Item label="Paises de venta" name="countries" className="form-item">
          <Input placeholder="Basic usage" />
        </Form.Item>

        <Form.Item className="form-item">
          <Button type="primary" onClick={handleSubmit}>
            buscar
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FilterForm;