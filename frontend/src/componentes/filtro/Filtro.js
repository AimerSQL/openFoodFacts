import { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import './Filtro.css';
import { useNavigate } from 'react-router-dom';
import { Select } from 'antd';
import Servicios from '../Servicios';
import { useTranslation } from "react-i18next";

const Filtro = ({ onLoading }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [selectedNutriScore, setSelectedNutriScore] = useState('');
  const { t } = useTranslation();
  

  const handleNutriScoreChange = (value) => {
    setSelectedNutriScore(value);
  };

  const handleSubmit = () => {
    onLoading(true)
    const isEmpty = Object.values(form.getFieldsValue()).every((value) => !value) && selectedNutriScore === "";
    if (!isEmpty) {
      const nameValue = form.getFieldValue("name");
      const categoriesValue = form.getFieldValue("categories");
      const brandsValue = form.getFieldValue("brands");
      const countriesValue = form.getFieldValue("countries");
      const data = {
        categories: categoriesValue,
        brands: brandsValue,
        countries: countriesValue,
        name: nameValue,
        nutriScore: selectedNutriScore,
      };

      Servicios.getFilteredProducts(data)
        .then(response => {
          navigate('/filtered-products', { state: response });
          onLoading(false)
        })
        .catch(error => {
          console.log(error);
          onLoading(false)
        });
    }

  };

  return (
    <Card title={t("Filtro")} bordered={true} className="filter-form-card">
      <Form layout="vertical" form={form}>
        <Form.Item label={t("Nombre")} name="name" className="form-item">
          <Input allowClear/>
        </Form.Item>

        <Form.Item label={t("Categorías")} name="categories" className="form-item">
          <Input allowClear/>
        </Form.Item>

        <Form.Item label={t("Marca")} name="brands" className="form-item">
          <Input allowClear/>
        </Form.Item>

        <Form.Item label={t("Paises de venta")} name="countries" className="form-item">
          <Input allowClear/>
        </Form.Item>

        <p>{t("Grado de nutrición")}</p>
        <Select
          style={{ width: '82%' }}
          showSearch
          allowClear
          optionFilterProp="children"
          onChange={handleNutriScoreChange}
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
            {t("Buscar")}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Filtro;