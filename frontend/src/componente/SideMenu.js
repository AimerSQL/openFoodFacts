import React, { useState } from 'react';

import {
    AreaChartOutlined,
    PictureOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
const { Sider } = Layout;

export default function sideMenu() {

    return (
        <Sider trigger={null} collapsible>
            <div className="logo" />
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                items={[
                    {
                        key: '1',
                        icon: <PictureOutlined />,
                        label: 'Menú',
                    },
                    {
                        key: '2',
                        icon: <SearchOutlined />,
                        label: 'Buscar',
                    },
                    {
                        key: '3',
                        icon: <AreaChartOutlined />,
                        label: 'Gráfica',
                    },
                ]}
            />
        </Sider>
    )

}
