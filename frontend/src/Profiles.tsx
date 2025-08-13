import React from 'react';
import { useState, useEffect } from 'react';
import { Col, Divider, Row, Button } from 'antd';
import { PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons';

import { ProfileService } from '../bindings/changeme'

const style: React.CSSProperties = { background: '#e9e9e9', padding: '10px 0' };

export default function Menu_Profiles() {
    const [msg, setMsg] = useState<string[]>([]);
    useEffect(() => {
         const fetchData = async () => {
            const result: string[] = await ProfileService.GetProfiles();
            setMsg(result);
        };
        fetchData();
    }, []);
    
    return (
        <div>
            <Divider orientation="left">
                Config
                <PlusCircleOutlined />
                <ReloadOutlined />
            </Divider>
            <Row gutter={[16, 24]}>
                {
                msg.map((name, i) => (
                    <Col className="gutter-row" span={10}>
                        <Button key={i} style={{ width: "100%", height: "100%" }}>
                            {name}
                        </Button>
                    </Col>
                ))
                }
            </Row>
        </div>
    )
}