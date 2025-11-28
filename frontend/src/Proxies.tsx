import React from 'react';
import { useState, useEffect } from 'react';
import { Col, Divider, Row } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';

import { CustomButton } from './CustomButton'
import { MioService } from '../bindings/changeme'

export default function Menu_Proxies() {
    const [proxies, setProxies] = useState<string[]>([]);
    const [types, setTypes] = useState<string[]>([]);
    const [delays, setDelays] = useState<number[]>([]);
    const [selectedKey, setSelectedKey] = useState<number | null>(null);

    const handleClick = async (key: number|null) => {
        if (selectedKey === key) return;

        setSelectedKey(key);
        await MioService.UpdateSelectedProxy(key);
        MioService.UpdateService(key);
    }

    const handleDelay = async (key: number) => {
        const delay: number = await MioService.DelayTest(key);
        setDelays(prev => ({
            ...prev,
            [key as number]: delay
        }));
    }

    const handleIcon = (delay: number) => {
        if (delay === undefined) return <ThunderboltOutlined />;
        else if (delay <= 0) return <span style={{ color: 'red' }}>Error</span>;
        else if (delay < 100) return <span style={{ color: 'green' }}>{delay}</span>;
        else if (delay < 500) return <span style={{ color: 'orange' }}>{delay}</span>;
        else return <span style={{ color: 'red' }}>{delay}</span>;
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
            [
                <Col className="gutter-row" sm={12} xl={6}>
                    <CustomButton
                        label = {"Direct"}
                        onMainClick = {() => handleClick(null)}
                        onIconClick = {() => alert("辅助功能触发！")}
                        selected = {selectedKey === null ? true : false}
                        icon = {<ThunderboltOutlined />}
                    />
                </Col>,
                proxies.map((name, i) => (
                    <Col className="gutter-row" sm={12} xl={6}>
                        <CustomButton
                            key = {i}
                            label = {name}
                            type = {types[i]}
                            onMainClick = {() => handleClick(i)}
                            onIconClick = {() => handleDelay(i)}
                            selected = {selectedKey === i ? true : false}
                            icon = {handleIcon(delays[i])}
                        />
                    </Col>
                ))
            ]
        }
        </Row>
      </div>
    )
}