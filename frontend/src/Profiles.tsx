import React from 'react';
import { useState, useEffect } from 'react';
import { Col, Divider, Row, Button, Input  } from 'antd';
import { CopyOutlined, ReloadOutlined, SettingOutlined  } from '@ant-design/icons';
import { CustomButton } from './CustomButton'
import { MioService } from '../bindings/changeme'

const Download = async (url: string) => {
    const result: string = await MioService.Download(url, "test.yaml")
    alert(result)
}

export default function Menu_Profiles() {
    const [msg, setMsg] = useState<string[]>([]);
    const [value, setValue] = useState<string>("")
    const [selectedKey, setSelectedKey] = useState<number | null>(null);

    useEffect(() => {
         const fetchData = async () => {
            const result: string[] = await MioService.GetProfiles();
            setMsg(result);
        };
        fetchData();
    }, []);

    const handleClick = (key: number, name: string) => {
        if (selectedKey === key) return;

        setSelectedKey(key);
        MioService.GetProxies(name);
    }

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
            <Row gutter={[12, 12]}>
                {
                msg.map((name, i) => (
                    <Col className="gutter-row" span={12}>
                        <CustomButton
                            key={i}
                            label={name}
                            onMainClick={() => handleClick(i, name)}
                            onIconClick={() => alert("辅助功能触发！")}
                            selected = {selectedKey === i ? true : false}
                            icon = {<SettingOutlined />}
                        />
                    </Col>
                ))
                }
            </Row>
        </div>
    )
}