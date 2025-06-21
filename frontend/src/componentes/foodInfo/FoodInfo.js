import React, { useState, useEffect } from 'react';
import { Card, Spin, Rate } from 'antd';
import { useParams, useLocation } from 'react-router-dom';
import Result404 from '../Result404';
import Servicios from '../Servicios';
import noImage from "../../fotos/no_image.png"; 
import axios from 'axios'
import { useTranslation } from "react-i18next";

function FoodInfo() {
  const { t } = useTranslation();
  const [productos, setProductos] = useState([]);
  const [rate, setRate] = useState({
    manufacturingLike: 0,
    packaging: 0,
    palmoilLike: 0,
    sizeLike: 0,
    storageLike: 0,
    transportLike: 0,
  });
  const [userRate, setUserRate] = useState({Like:0,});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productName = queryParams.get('productName');
  const hasLetter = (id) => {
    const regex = /[a-zA-Z]/;
    return regex.test(id);
  };

  const token = localStorage.getItem("token");
  const getFood = async (id, productName) => {
    try {
      let response;
      if (hasLetter(id)) {
        response = await axios.get(
          `http://localhost:4000/products/${id}?productName=${encodeURIComponent(
            productName
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.get(
          `http://localhost:4000/products/barcode/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setLoading(false);
      setProductos(response.data);
    } catch (error) {
      console.log("error get", error);
      setLoading(false);
      setProductos([]);
    }
  };

  const getRate = async (id) => {
    Servicios.getFoodRate(id)
      .then((data) => {
        setRate(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([getFood(id, productName), getRate(id)]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const imgURL =
    !loading && productos && productos.image_url
      ? productos.image_url
      : noImage

  const tabList = [
    {
      key: "tab1",
      tab: t("Información del producto"),
    },
    {
      key: "tab2",
      tab: t("Información nutricional (100 g / 100 ml)"),
    },
    {
      key: "tab3",
      tab: t("Valoraciones"),
    },
    {
      key: "tab4",
      tab: t("Simpatía"),
    },
  ];

  const handleTab4RatingChange = (category, value) => {
    setUserRate({ ...userRate, [category]: value });
    axios.post(`http://localhost:4000/rate`, { id, category, rating: value })
      .then(response => {
        console.log("Rating for " + category + " submitted successfully:", response.data);
      })
      .catch(error => {
        console.error("Error submitting rating for " + category + ":", error);
      });
  };

  const contentList = {
    tab1: (
      <div>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>{t("Nombre")}:</span>{" "}
          <span
            style={{ display: "flex", alignItems: "center", fontSize: "15px" }}
          >
            {productos.product_name ? productos.product_name : "?"}
          </span>
        </p>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>{t("Barcode")}:</span>{" "}
          <span
            style={{ display: "flex", alignItems: "center", fontSize: "15px" }}
          >
            {productos.barcode ? productos.barcode : "?"}
          </span>
        </p>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>{t("Marca")}:</span>{" "}
          <span
            style={{ display: "flex", alignItems: "center", fontSize: "15px" }}
          >
            {productos.brand ? productos.brand : "?"}
          </span>
        </p>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>
            {t("Pais de origen")}:
          </span>{" "}
          <span
            style={{ display: "flex", alignItems: "center", fontSize: "15px" }}
          >
            {productos.countries_en ? productos.countries_en : "?"}
          </span>
        </p>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>
            {t("Ingredientes")}:
          </span>{" "}
          <span
            style={{ display: "flex", alignItems: "center", fontSize: "15px" }}
          >
            {productos.ingretients_text ? productos.ingretients_text : "?"}
          </span>
        </p>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>
            {t("Categorias")}:
          </span>{" "}
          <span
            style={{ display: "flex", alignItems: "center", fontSize: "15px" }}
          >
            {productos.categories != "" ? productos.categories : "?"}
          </span>
        </p>
      </div>
    ),

    tab2: (
      <div>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>{t("Energía")}:</span>{" "}
          <span
            style={{ display: "flex", alignItems: "center", fontSize: "15px" }}
          >
            {productos.energy_100g ? productos.energy_100g : "?"} KJ
          </span>
        </p>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>{t("Grasas")}:</span>{" "}
          <span
            style={{ display: "flex", alignItems: "center", fontSize: "15px" }}
          >
            {productos.fat_100g ? productos.fat_100g : "?"} g
          </span>
        </p>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>
            {t("Hidratos de carbono")}:
          </span>{" "}
          <span
            style={{ display: "flex", alignItems: "center", fontSize: "15px" }}
          >
            {productos.carbohydrates_100g ? productos.carbohydrates_100g : "?"}{" "}
            g
          </span>
        </p>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>
            {t("Azúcares")}:
          </span>{" "}
          <span
            style={{ display: "flex", alignItems: "center", fontSize: "15px" }}
          >
            {productos.sugars_100g ? productos.sugars_100g : "?"} g
          </span>
        </p>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>
            {t("Fibra alimentaria")}:
          </span>{" "}
          <span
            style={{ display: "flex", alignItems: "center", fontSize: "15px" }}
          >
            {productos.fiber_100g ? productos.fiber_100g : "?"} g
          </span>
        </p>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>
            {t("Proteínas")}:
          </span>{" "}
          <span
            style={{ display: "flex", alignItems: "center", fontSize: "15px" }}
          >
            {productos.proteins_100g ? productos.proteins_100g : "?"} g
          </span>
        </p>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>{t("Sal")}:</span>{" "}
          <span
            style={{ display: "flex", alignItems: "center", fontSize: "15px" }}
          >
            {productos.salt_100g ? productos.salt_100g : "?"} g
          </span>
        </p>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}> {t("Sodio")}:</span>{" "}
          <span
            style={{ display: "flex", alignItems: "center", fontSize: "15px" }}
          >
            {productos.sodium_100g ? productos.sodium_100g : "?"} g
          </span>
        </p>
      </div>
    ),

    tab3: (
      <div>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>
             {t("Fabricación")}:
          </span>{" "}
          <span style={{ display: "flex", alignItems: "center" }}>
            <Rate disabled defaultValue={rate.manufacturingLike} />
          </span>
        </p>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>
            {t("Embalaje")}:
          </span>{" "}
          <span style={{ display: "flex", alignItems: "center" }}>
            <Rate disabled defaultValue={rate.palmoilLike} />
          </span>
        </p>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>{t("Aceite de palma")}:</span>{" "}
          <span style={{ display: "flex", alignItems: "center" }}>
            <Rate disabled defaultValue={rate.palmoilLike} />
          </span>
        </p>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>{t("Tamaño")}:</span>{" "}
          <span style={{ display: "flex", alignItems: "center" }}>
            <Rate disabled defaultValue={rate.sizeLike} />
          </span>
        </p>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>{t("Almacenamiento")}:</span>{" "}
          <span style={{ display: "flex", alignItems: "center" }}>
            <Rate disabled defaultValue={rate.storageLike} />
          </span>
        </p>
        <p>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>
            {t("Transporte")}:
          </span>{" "}
          <span style={{ display: "flex", alignItems: "center" }}>
            <Rate disabled defaultValue={rate.transportLike} />
          </span>
        </p>
      </div>
    ),
    tab4: (
      <div>
        {console.log('Tab4 Like Rate:', userRate.Like)}
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '30px' }}>{t("Like")}:</span>{" "}
          <span style={{ display: "flex", alignItems: "center"}}>
            <Rate value={userRate.Like || 0} onChange={(value) => handleTab4RatingChange('Like', value)} />
          </span>
        </p>
      </div>
    )
  };

  const [activeTabKey1, setActiveTabKey1] = useState("tab1");
  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "300px",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : productos.product_name != null ? (
        <div style={{ display: "flex", height: "70vh" }}>
          <div
            style={{
              flex: "3",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ width: "300px", height: "300px", padding: "10px" }}>
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src={productos?.image_url || noImage}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = noImage;
                }}
              />
            </div>
          </div>
          <div
            style={{
              flex: "7",
              display: "flex",
              justifyContent: "center",
              marginTop: "3%",
              alignItems: "center",
            }}
          >
            <Card
              style={{
                width: "80%",
                height: "110%",
                marginLeft: "10%",
                marginRight: "10%",
                overflowY: "auto",
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
        <Result404 subTitle={"No hay datos!"} />
      )}
    </>
  );
}

export default FoodInfo;
