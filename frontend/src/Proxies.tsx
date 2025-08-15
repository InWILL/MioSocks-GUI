import React from 'react';
import { useState, useEffect } from 'react';
import { Col, Divider, Row, Button } from 'antd';
import { ThunderboltTwoTone } from '@ant-design/icons';

import { MioService } from '../bindings/changeme'

const style: React.CSSProperties = { background: '#e9e9e9', padding: '8px 0' };

type ProxyButtonType = {
    label: string;
    onMainClick: () => void;
    onIconClick: () => void;
    icon?: React.ReactNode;
};

export const ProxyButton: React.FC<ProxyButtonType> = ({
  label,
  onMainClick,
  onIconClick,
  icon = <ThunderboltTwoTone />
}) => {
  return (
    <div
        style={{
            display: "inline-flex",
            border: "1px solid #d9d9d9",
            borderRadius: 6,
            overflow: "hidden",
            width: "100%",
        }}
    >
        {/* 主功能按钮 */}
        <Button
            type="default"
            onClick={onMainClick}
            style={{
            border: "none",
            borderRadius: 0,
            flex: 1,
            padding: 0,
            }}
        >
            {label}
        </Button>
        {/* 辅助功能按钮（带图标） */}
        <Button
            type="default"
            icon={icon}
            onClick={(e) => {
            e.stopPropagation(); // 防止触发主功能
            onIconClick?.();
            }}
            style={{
            border: "none",
            borderLeft: "1px solid #d9d9d9",
            borderRadius: 0,
            width: 40,
            }}
        />
    </div>
  );
};

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
                    <ProxyButton
                        key={i}
                        label={name}
                        onMainClick={() => alert("主要功能触发！")}
                        onIconClick={() => alert("辅助功能触发！")}
                    />
                </Col>
            ))
        }
        </Row>
        <Divider orientation="left">Rules</Divider>
      </div>
    )
}