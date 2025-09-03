import { useState, useEffect } from 'react';
import { Col, Divider, Row, Button } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { CustomButton } from './CustomButton'
import { MioService } from '../bindings/changeme'

export default function Menu_Rules() {
    const [rules, setRules] = useState<string[]>([]);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    const handleClick = async (key: string|null) => {
        if (selectedKey === key) return;

        setSelectedKey(key);
        //await MioService.UpdateSelectedProxy(key);
        //MioService.UpdateProxy(index)
    }

    useEffect(() => {
        const GetRules = async () => {
            const result: string[] = await MioService.GetRules();
            setRules(result);

            const key: string|null = await MioService.GetSelectedRule();
            setSelectedKey(key);
        };
        GetRules();
    }, []);

    return (
        <div>
            <Divider orientation="left">
                Rules
                <Button 
                    icon={<PlusOutlined />}
                    type='text'
                />
            </Divider>
            <Row gutter={[12, 12]}>
            {
                [
                    <Col className="gutter-row" span={12}>
                    <CustomButton
                        label = {"Direct"}
                        onMainClick = {() => handleClick(null)}
                        onIconClick = {() => {}}
                        selected = {selectedKey === null ? true : false}
                        icon = {<EditOutlined />}
                    />
                    </Col>,
                    rules.map((name, i) => (
                        <Col className="gutter-row" span={12}>
                            <CustomButton
                                key={i}
                                label={name}
                                onMainClick={() => handleClick(name)}
                                onIconClick={() => alert("辅助功能触发！")}
                                selected = {selectedKey === name ? true : false}
                                icon = {<EditOutlined />}
                            />
                        </Col>
                    ))
                ]
            }
            </Row>
        </div>
    )
}