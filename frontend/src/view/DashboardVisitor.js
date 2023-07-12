import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Layout, theme } from 'antd'

import TopHeader from '../componente/TopHeader'
import Grafica from '../componente/Grafica'
import Menu from '../componente/Menu'
import FoodInfo from '../componente/FoodInfo'
import FilteredProducts from '../componente/FilteredProducts'
import './DashboardVisitor.css'

const { Content, Footer } = Layout;

export default function DashboardVisitor() {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <BrowserRouter>
            <Layout>

                <TopHeader />

                <Layout>

                    <Content style={{ padding: 20, minHeight: 380, background: colorBgContainer }}>

                        <Routes>
                            <Route path="/" element={<Navigate to="/menu" />} />
                            <Route path="/menu" element={<Menu />} />
                            <Route path="/grafica" element={<Navigate to="/grafica/humedad" />} />
                            <Route path="/grafica/humedad" element={<Grafica dataType="humedad" title="Humedad" />} />
                            <Route path="/grafica/temperatura" element={<Grafica dataType="temperatura" title="Temperatura" />} />
                            <Route path="/grafica/Eco2" element={<Grafica dataType="eco2" title="eCo2" />} />
                            <Route path="/grafica/Tvoc" element={<Grafica dataType="tvoc" title="Tvoc" />} />
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
