import React from 'react';
import { useState, useEffect } from 'react';
import { Col, Divider, Row, Button, Tooltip  } from 'antd';
import { PlusCircleOutlined, ReloadOutlined, SettingOutlined  } from '@ant-design/icons';
import { CustomButton } from './CustomButton'
import { MioService } from '../bindings/changeme'

const style: React.CSSProperties = { background: '#e9e9e9', padding: '10px 0' };

const GetProxies = (e: string) => {
    MioService.GetProxies(e);
};

export default function Menu_Profiles() {
    const [msg, setMsg] = useState<string[]>([]);
    useEffect(() => {
         const fetchData = async () => {
            const result: string[] = await MioService.GetProfiles();
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
                        <CustomButton
                            key={i}
                            label={name}
                            onMainClick={() => GetProxies(name)}
                            onIconClick={() => alert("辅助功能触发！")}
                            icon = {<SettingOutlined />}
                        />
                    </Col>
                ))
                }
            </Row>
        </div>
    )
}