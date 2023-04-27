import './DashboardVisitor.css'

import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import TopHeader from '../componente/TopHeader'

import { Layout, Breadcrumb, theme } from 'antd'
import { HomeOutlined } from '@ant-design/icons';

import RedirectOnce from '../router/RedirectOnce';
import GraficaHumedad from '../componente/grafica/GraficaHumedad'
import GraficaTemp from '../componente/grafica/GraficaTemp'
import GraficaEco2 from '../componente/grafica/GraficaEco2'
import GraficaTvoc from '../componente/grafica/GraficaTvoc'
import Menu from '../componente/Menu'
import FoodInfo from '../componente/FoodInfo'
import FilteredProducts from '../componente/FilteredProducts'
const { Content, Footer } = Layout;

export default function DashboardVisitor(props) {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <BrowserRouter>
            <Layout>

                <TopHeader />

                <Layout>

                    <Content style={{ padding: /* '0 50px' */20, minHeight: 380, background: colorBgContainer }}>

                        {/*<Breadcrumb separator=">" style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>啊吧啊吧</Breadcrumb.Item>
                            <Breadcrumb.Item>啊吧啊吧</Breadcrumb.Item>
                        </Breadcrumb> */}

                        {/*<div style={{ padding: 24, minHeight: 380, background: colorBgContainer }}>Content</div> */}

                        <Routes>

                            {/* <Route path="/" element={<RedirectOnce />} /> */}
                            <Route path="/" element={<Navigate to="/menu" />} />
                            <Route path="/menu" element={<Menu />} />
                            <Route path="/grafica" element={<Navigate to="/grafica/humedad" />} />
                            <Route path="/grafica/humedad" element={<GraficaHumedad />} />
                            <Route path="/grafica/temperatura" element={<GraficaTemp />} />
                            <Route path="/grafica/Eco2" element={<GraficaEco2 />} />
                            <Route path="/grafica/Tvoc" element={<GraficaTvoc />} />
                            <Route path="/grafica" element={<Navigate to="/grafica/humedad" />} />
                            <Route path="/foodInfo/:id" element={<FoodInfo />} />
                            <Route path="/filtered-products" element={<FilteredProducts />} />
                        </Routes>


                    </Content>

                </Layout>

                <Footer style={{ textAlign: 'center' }}>TFG UPM ETSISI 2022 - 2023</Footer>

            </Layout>
        </BrowserRouter>
    )
}
