import { useState, useEffect } from 'react';
import { Col, Divider, Row, Button, Modal } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import Editor from "@monaco-editor/react";
import { CustomButton } from './CustomButton'
import { MioService } from '../bindings/changeme'

export default function Menu_Rules() {
    const [rules, setRules] = useState<string[]>([]);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const [editorTitle, setEditorTitle] = useState<string>("YAML Editor");
    const [yamlText, setYamlText] = useState<string>("");

    const handleEditor = (title: string) => {
        setEditorTitle(title);
        setShowEditor(true);
    }

    const handleSave = () => {
        setShowEditor(false);
    }

    const handleClick = async (key: string|null) => {
        if (selectedKey === key) return;

        setSelectedKey(key);
        //await MioService.UpdateSelectedProxy(key);
        //MioService.UpdateProxy(index)
    }

    useEffect(() => {
        const GetRules = async () => {
            const result: string[] = await MioService.GetRules();
            const key: string|null = await MioService.GetSelectedRule();
            setRules(result);
            setSelectedKey(key);
        };
        GetRules();
    }, []);

    return (
        <div>
            <Modal
                title={editorTitle}
                open={showEditor}
                onCancel={() => setShowEditor(false)}
                onOk={handleSave}
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
                Rules
                <Button 
                    icon={<PlusOutlined />}
                    type='text'
                    onClick={() => handleEditor("New Title")}
                />
            </Divider>
            <Row gutter={[12, 12]}>
            {
                [
                    <Col className="gutter-row" span={12}>
                    <CustomButton
                        label = {"Direct"}
                        onMainClick = {() => handleClick(null)}
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
                                onIconClick={() => handleEditor(name)}
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