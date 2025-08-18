import React from 'react';
import { useState, useEffect } from 'react';
import { Col, Divider, Row } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';

import { CustomButton } from './CustomButton'
import { MioService } from '../bindings/changeme'

export default function Menu_Proxies() {
    const [msg, setMsg] = useState<string[]>([]);
    const [selectedKey, setSelectedKey] = useState<number | null>(null);

    const handleClick = (key: number) => {
        if (selectedKey === key) return;

        setSelectedKey(key);
        //MioService.UpdateProxy(index)
    }

    useEffect(() => {
        const ParseProxies = async () => {
            try{
                const result: string[] = await MioService.ParseProxies();
                setMsg(result);
            } catch(err) {
                console.error("Failed to parse proxies:", err);
            }
        };
        ParseProxies();
        }, []
    );
    
    return (
      <div>
        <Divider orientation="left">Server</Divider>
        <Row gutter={[12, 12]}>
        {
            msg.map((name, i) => (
                <Col className="gutter-row" span={12}>
                    <CustomButton
                        key = {i}
                        label = {name}
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