import React from 'react';
import { useState, useEffect } from 'react';
import { Col, Divider, Row } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';

import { CustomButton } from './CustomButton'
import { MioService } from '../bindings/changeme'

export default function Menu_Proxies() {
    const [proxies, setProxies] = useState<string[]>([]);
    const [types, setTypes] = useState<string[]>([]);
    const [selectedKey, setSelectedKey] = useState<number | null>(null);

    const handleClick = async (key: number|null) => {
        if (selectedKey === key) return;

        setSelectedKey(key);
        await MioService.UpdateSelectedProxy(key);
        //MioService.UpdateProxy(index)
    }

    useEffect(() => {
        const GetProxies = async () => {
            try{
                const [name, type] = await MioService.GetProxies();
                setProxies(name);
                setTypes(type);

                const index: number|null = await MioService.GetSelectedProxy();
                setSelectedKey(index);
            } catch(err) {
                console.error("Failed to parse proxies:", err);
            }
        };
        GetProxies();
        }, []
    );
    
    return (
      <div>
        <Divider orientation="left">Server</Divider>
        <Row gutter={[12, 12]}>
        {
            proxies.map((name, i) => (
                <Col className="gutter-row" span={12}>
                    <CustomButton
                        key = {i}
                        label = {name}
                        type = {types[i]}
                        onMainClick = {() => handleClick(i)}
                        onIconClick = {() => alert("辅助功能触发！")}
                        selected = {selectedKey === i ? true : false}
                        icon = {<ThunderboltOutlined />}
                    />
                </Col>
            ))
        }
        </Row>
        <Divider orientation="left">Rules</Divider>
      </div>
    )
}