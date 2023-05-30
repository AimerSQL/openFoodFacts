import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import './Filtro.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Select } from 'antd';


const onSearch = (value) => {
  console.log('search:', value);
};

const FilterForm = ({ onFilterSubmit }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [selectedNutriScore, setSelectedNutriScore] = useState('');

  const handleNutriScoreChange = (value) => {
    setSelectedNutriScore(value);
  };

  const handleSubmit = () => {
    const isEmpty = Object.values(form.getFieldsValue()).every((value) => !value) && selectedNutriScore == "";
    if (!isEmpty) {
      const nameValue = form.getFieldValue("name");
      const categoriesValue = form.getFieldValue("categories");
      const brandsValue = form.getFieldValue("brands");
      const countriesValue = form.getFieldValue("countries");
      const data = {
        categories: categoriesValue,
        brands: brandsValue,
        countries: countriesValue,
        name:nameValue,
        nutriScore: selectedNutriScore,
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
      <Form.Item label="Name" name="name" className="form-item">
          <Input placeholder="Basic usage" />
        </Form.Item>

        <Form.Item label="Categorías" name="categories" className="form-item">
          <Input placeholder="Basic usage" />
        </Form.Item>

        <Form.Item label="Marca" name="brands" className="form-item">
          <Input placeholder="Basic usage" />
        </Form.Item>

        <Form.Item label="Paises de venta" name="countries" className="form-item">
          <Input placeholder="Basic usage" />
        </Form.Item>

        <p>Grado de nutrición</p>
        <Select
          showSearch
          placeholder="nutricion"
          optionFilterProp="children"
          onChange={handleNutriScoreChange}
          onSearch={onSearch}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={[
            {
              value: 'a',
              label: 'A',
            },
            {
              value: 'b',
              label: 'B',
            },
            {
              value: 'c',
              label: 'C',
            },
            {
              value: 'd',
              label: 'D',
            },
            {
              value: 'e',
              label: 'E',
            },
          ]}
        />
        <Form.Item className="form-item" style={{ marginTop: "20px" }}>
          <Button type="primary" onClick={handleSubmit}>
            Buscar
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FilterForm;