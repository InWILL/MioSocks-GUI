import React from 'react';
import { useState, useEffect } from 'react';
import { Col, Divider, Row, Button, Input  } from 'antd';
import { CopyOutlined, ReloadOutlined, SettingOutlined  } from '@ant-design/icons';
import { CustomButton } from './CustomButton'
import { MioService } from '../bindings/changeme'

const style: React.CSSProperties = { background: '#e9e9e9', padding: '10px 0' };

const GetProxies = (e: string) => {
    MioService.GetProxies(e);
};

const Download = async (url: string) => {
    const result: string = await MioService.Download(url, "test.yaml")
    alert(result)
}

export default function Menu_Profiles() {
    const [msg, setMsg] = useState<string[]>([]);
    const [value, setValue] = useState<string>("")
    useEffect(() => {
         const fetchData = async () => {
            const result: string[] = await MioService.GetProfiles();
            setMsg(result);
        };
        fetchData();
    }, []);

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                }}
                >
                <Input
                    placeholder="输入内容或URL…"
                    allowClear
                    onChange = {(e) => setValue(e.target.value)}
                    suffix={
                        <Button 
                            icon = {<CopyOutlined />} 
                            type ='text' 
                            style={{ color: "#999999" }}
                        />
                    }
                />
                <Button 
                    onClick={() => Download(value)}
                >
                    Download
                </Button>
                <Button>Update</Button>
                <Button>Import</Button>
            </div>
            <Divider orientation="left">
                Config
                <Button 
                    icon={<ReloadOutlined />}
                    type='text'
                />
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