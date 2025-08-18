import { useState } from 'react';
import { List, Switch, Button, Tooltip, Typography, Modal, InputNumber } from "antd"
import { InfoCircleOutlined, FolderOpenOutlined } from '@ant-design/icons';
const { Text } = Typography;

export default function Menu_General() {
    const [Socks5Disabled, setSocks5Disabled] = useState<boolean>(false);
    const [Socks5Modal, setSocks5Modal] = useState<boolean>(false);
    const [Socks5Port, setSocks5Port] = useState<number>(2801);
    const [tempPort, setTempPort] = useState<number>(Socks5Port);

    const handleSocks5Modal = () => {
        setSocks5Modal(false);
        setSocks5Port(tempPort);
    }

    const Socks5Switch = (checked: boolean) => {
        if (checked) {
            setSocks5Disabled(false);
        }
        else {
            setSocks5Disabled(true);
        }
    }

    const settingsData = [
        {
            title: 'Socks5 Port',
            control:
            <div>
                <Button type="text" disabled={Socks5Disabled} onClick={()=>setSocks5Modal(true)}>
                    : {Socks5Port}
                </Button>
                <Modal
                    title="Port Number:"
                    open={Socks5Modal}
                    onOk={handleSocks5Modal}
                    onCancel={() => setSocks5Modal(false)}
                >
                    <InputNumber
                        min={1}
                        max={65535}
                        defaultValue={2801}
                        onChange = {(val: number) => {setTempPort(val)}}
                    >
                    </InputNumber>
                </Modal>
                <Switch defaultChecked={true} onChange={Socks5Switch}/>
            </div>
        },
        {
            title: 'Allow LAN',
            tooltip: '允许局域网设备连接',
            control: 
            <Switch 
                defaultChecked={false} 
                disabled={Socks5Disabled}
            />
        },
        {
            title: 'Log Level',
            tooltip: '日志输出等级',
            control: <Button type="text">info</Button>
        },
        {
            title: 'IPv6',
            tooltip: '启用 IPv6',
            control: <Switch defaultChecked={false} />
        },
        {
            title: 'MioSocks Core',
            tooltip: '内核版本信息',
            control: <Text>2023.08.17-13-gdcc8d87 Premium (62236)</Text>
        },
        {
            title: 'Home Directory',
            tooltip: '配置文件目录',
            control: 
            <Button 
                type="link" 
                icon={<FolderOpenOutlined />}
            >
                Open Folder
            </Button>
        },
        {
            title: 'System Proxy',
            tooltip: '设置系统代理',
            control: <Switch defaultChecked={false} />
        }
    ];
    return (
    <List
        itemLayout="horizontal"
        dataSource={settingsData}
        renderItem={(item) => (
            <List.Item actions={[item.control]} style={{paddingLeft: 10, paddingRight: 10}} >
                <div style={{ width: 140, textAlign: 'left'}}>
                {item.title}
                <Tooltip title={item.tooltip}>
                    <InfoCircleOutlined style={{ marginLeft: 8, color: '#999' }} />
                </Tooltip>
                </div>
                
            </List.Item>
        )}
    />

    );
}