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

    const handleDelay = async (key: number|null) => {
        const delay: number = await MioService.DelayTest(key);
        setDelays(prev => ({
            ...prev,
            [key as number]: delay
        }));
    }

    const getColor = (delay: number) => {
        if (delay < 100) return 'green';
        else if (delay < 500) return 'orange';
        else return 'red';
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
                            icon = {
                                delays[i] !== undefined
                                ? <span style={{ color: getColor(delays[i]) }}>
                                    {delays[i]}
                                    </span>
                                : <ThunderboltOutlined />
                            }
                        />
                    </Col>
                ))
            ]
        }
        </Row>
      </div>
    )
}