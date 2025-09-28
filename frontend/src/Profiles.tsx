import React from 'react';
import { useState, useEffect } from 'react';
import { Col, Divider, Row, Button, Input, Modal  } from 'antd';
import { CopyOutlined, CheckOutlined, ReloadOutlined, SettingOutlined, PlusOutlined  } from '@ant-design/icons';
import Editor from "@monaco-editor/react";
import { CustomButton } from './CustomButton'
import { MioService } from '../bindings/changeme'

const Download = async (url: string) => {
    const result: string = await MioService.Download(url, "test.yaml")
    alert(result)
}

export default function Menu_Profiles() {
    const [msg, setMsg] = useState<string[]>([]);
    const [selectedKey, setSelectedKey] = useState<number | null>(null);
    const [InputValue, setInputValue] = useState<string>("");
    const [CopyClicked, setCopyClicked] = useState<boolean>(false);

    const [showEditor, setShowEditor] = useState<boolean>(false);
    const [editorTitle, setEditorTitle] = useState<string>("YAML Editor");
    const [yamlText, setYamlText] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const result: string[] = await MioService.GetProfiles();
            setMsg(result);

            const selected: number|null = await MioService.GetSelectedProfile();
            if(selected != null) {
                setSelectedKey(selected);
            }
        };
        fetchData();
    }, []);

    const handleClick = async (key: number) => {
        if (selectedKey === key) return;

        setSelectedKey(key);
        await MioService.UpdateSelectedProfile(key);
        await MioService.ReadProxies();
        await MioService.GetProxies();
    }

    const handleCopyClick = async () => {
        await navigator.clipboard.writeText(InputValue);
        setCopyClicked(true);
        setTimeout(() => setCopyClicked(false), 1000);
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
                    onChange = {(e) => setInputValue(e.target.value)}
                    suffix={
                        <Button 
                            icon = { CopyClicked == true ? <CheckOutlined />:<CopyOutlined />} 
                            type ='text' 
                            style={{ color: "#999999" }}
                            onClick = {handleCopyClick}
                        />
                    }
                />
                <Button 
                    onClick={() => Download(InputValue)}
                >
                    Download
                </Button>
                <Button>Update</Button>
                <Button>Import</Button>
            </div>

            <Modal
                title={
                    <Input
                        value={editorTitle}
                        onChange={(e) => setEditorTitle(e.target.value)}
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            border: "none",
                        }}
                    />
                }
                open={showEditor}
                onCancel={() => setShowEditor(false)}
                onOk={() => {}}
                width={"90%"}
                bodyStyle={{ height: "50vh", padding: 0 }}
            >
                <Editor
                    defaultLanguage="yaml"
                    value={yamlText}
                    theme="vs-light"
                    options={{ minimap: { enabled: false } }}
                    onChange={(val) => setYamlText(val)}
                />
            </Modal>

            <Divider orientation="left">
                Config
                <Button 
                    icon={<PlusOutlined />}
                    type='text'
                    onClick={() => setShowEditor(true)}
                />
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
                            onMainClick={() => handleClick(i)}
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