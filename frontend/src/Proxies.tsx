import React from 'react';
import { useState, useEffect } from 'react';
import { Col, Divider, Row } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';

import { CustomButton } from './CustomButton'
import { MioService } from '../bindings/changeme'

const style: React.CSSProperties = { background: '#e9e9e9', padding: '8px 0' };

export default function Menu_Proxies() {
    const [msg, setMsg] = useState<string[]>([]);
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
        <Row gutter={[16, 24]}>
        {
            msg.map((name, i) => (
                <Col className="gutter-row" span={10}>
                    <CustomButton
                        key = {i}
                        label = {name}
                        onMainClick = {() => alert("主要功能触发！")}
                        onIconClick = {() => alert("辅助功能触发！")}
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