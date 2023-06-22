import React, { useState, useEffect } from 'react';
import { Card, Result, Spin, Rate } from 'antd';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import Result404 from './Result404';

function FoodInfo() {
  const [productos, setProductos] = useState([]);
  const [rate, setRate] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id  } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productName = queryParams.get('productName');
  const hasLetter = (id) => {
    const regex = /[a-zA-Z]/;
    return regex.test(id);
  };

  const getfood = async (id,productName ) => {
    let response;
    if (hasLetter(id)) {  
      response = await axios.get(`http://localhost:4000/products/${id}?productName=${encodeURIComponent(productName)}`);
    } else {
      response = await axios.get(`http://localhost:4000/products/barcode/${id}`);
    }
    setProductos(response.data);
    setLoading(false);
  };



  const getrate = async (id) => {
    const response = await axios.get(`http://localhost:4000/rate-products/${id}`);
    setRate(response.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([getfood(id,productName ), getrate(id)]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    fetchData();
  }, [id]);


  const product = productos;

  const imgURL = !loading && product && product.image_url ? product.image_url : 'data:image/png;base64,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';
  
  const tabList = [
    {
      key: 'tab1',
      tab: 'Información del producto',
    },
    {
      key: 'tab2',
      tab: 'Información nutricional (100 g / 100 ml)',
    },
    {
      key: 'tab3',
      tab: 'Valoraciones',
    },
  ];

  const contentList = {
    tab1:
      <div>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Nombre:</span>{" "}
          <span style={{ display: "flex", alignItems: "center", fontSize: '18px' }}>
            {product.product_name ? product.product_name : "?"}
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Barcode:</span>{" "}
          <span style={{ display: "flex", alignItems: "center", fontSize: '18px' }}>
            {product.barcode ? product.barcode : "?"}
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Marca:</span>{" "}
          <span style={{ display: "flex", alignItems: "center", fontSize: '18px'  }}>
            {product.brand ? product.brand : "?"}
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Pais de origen:</span>{" "}
          <span style={{ display: "flex", alignItems: "center", fontSize: '18px'  }}>
            {product.countries_en ? product.countries_en : "?"}
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Ingredientes:</span>{" "}
          <span style={{ display: "flex", alignItems: "center", fontSize: '18px'  }}>
            {product.ingretients_text ? product.ingretients_text : "?"}
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Categorias:</span>{" "}
          <span style={{ display: "flex", alignItems: "center", fontSize: '18px'  }}>
            {product.categories/* .length > 0 */ ? product.categories : "?"}
          </span>
        </p>
      </div>,

    tab2:
      <div>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Energía:</span>{" "}
          <span style={{ display: "flex", alignItems: "center", fontSize: '18px'  }}>
            {product.energy_100g ? product.energy_100g : "?"} KJ
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Grasas:</span>{" "}
          <span style={{ display: "flex", alignItems: "center", fontSize: '18px'  }}>
            {product.fat_100g ? product.fat_100g : "?"} g
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Hidratos de carbono:</span>{" "}
          <span style={{ display: "flex", alignItems: "center", fontSize: '18px'  }}>
            {product.carbohydrates_100g ? product.carbohydrates_100g : "?"} g
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Azúcares:</span>{" "}
          <span style={{ display: "flex", alignItems: "center", fontSize: '18px'  }}>
            {product.sugars_100g ? product.sugars_100g : "?"} g
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Fibra alimentaria:</span>{" "}
          <span style={{ display: "flex", alignItems: "center", fontSize: '18px'  }}>
            {product.fiber_100g ? product.fiber_100g : "?"} g
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Proteínas:</span>{" "}
          <span style={{ display: "flex", alignItems: "center", fontSize: '18px'  }}>
            {product.proteins_100g ? product.proteins_100g : "?"} g
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Sal:</span>{" "}
          <span style={{ display: "flex", alignItems: "center", fontSize: '18px'  }}>
            {product.salt_100g ? product.salt_100g : "?"} g
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Sodio:</span>{" "}
          <span style={{ display: "flex", alignItems: "center", fontSize: '18px'  }}>
            {product.sodium_100g ? product.sodium_100g : "?"} g
          </span>
        </p>
      </div>,

    tab3:
      <div>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Manufacturing:</span>{" "}
          <span style={{ display: "flex", alignItems: "center" }}>
            <Rate disabled defaultValue={rate.manufacturingLike} />
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Packaging:</span>{" "}
          <span style={{ display: "flex", alignItems: "center" }}>
            <Rate disabled defaultValue={rate.palmoilLike} />
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Palmoil:</span>{" "}
          <span style={{ display: "flex", alignItems: "center" }}>
            <Rate disabled defaultValue={rate.palmoilLike} />
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Size:</span>{" "}
          <span style={{ display: "flex", alignItems: "center" }}>
            <Rate disabled defaultValue={rate.sizeLike} />
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Storage:</span>{" "}
          <span style={{ display: "flex", alignItems: "center" }}>
            <Rate disabled defaultValue={rate.storageLike} />
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Transport:</span>{" "}
          <span style={{ display: "flex", alignItems: "center" }}>
            <Rate disabled defaultValue={rate.transportLike} />
          </span>
        </p>
      </div>
  };

  const [activeTabKey1, setActiveTabKey1] = useState('tab1');
  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };



  return (
    loading ? (
      <div style={{ display: 'flex', justifyContent: 'center', height: '300px', alignItems: 'center' }}>
        <Spin size="large" />
      </div>
    ) :
      <>
        {productos.product_name ? (
          <div style={{ display: 'flex', height: '70vh' }}>
            <div style={{ flex: '3', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: '300px', height: '300px', padding: '10px' }}>
                <img style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} src={imgURL} />
              </div>
            </div>
            <div style={{ flex: '7', display: 'flex', justifyContent: 'center', marginTop: '3%', alignItems: 'center' }}>
              <Card
                style={{
                  width: '80%',
                  height: '110%',
                  marginLeft: '10%',
                  marginRight: '10%'


                }}
                title=""
                hoverable
                tabList={tabList}
                activeTabKey={activeTabKey1}
                onTabChange={onTab1Change}
              >
                {contentList[activeTabKey1]}
              </Card>
            </div>
          </div>

        ) : (
          <Result404
            subTitle={'Código de barras incorrecto, introduce otra vez! '}
          />
        )}
      </>
  );


}

export default FoodInfo;