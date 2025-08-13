import { List, Switch, Button, Tooltip, Typography } from "antd"
import { InfoCircleOutlined, FolderOpenOutlined } from '@ant-design/icons';
const { Text } = Typography;

const settingsData = [
  {
    title: 'Allow LAN',
    tooltip: '允许局域网设备连接',
    control: <Switch defaultChecked={false} />
  },
  {
    title: 'Log Level',
    tooltip: '日志输出等级',
    control: <Text>info</Text>
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
    control: <Button type="link" icon={<FolderOpenOutlined />}>Open Folder</Button>
  },
  {
    title: 'Service Mode',
    tooltip: '以系统服务运行',
    control: <Button type="link">Manage</Button>
  },
  {
    title: 'TUN Mode',
    tooltip: '虚拟网卡模式',
    control: <Switch defaultChecked={false} />
  },
  {
    title: 'System Proxy',
    tooltip: '设置系统代理',
    control: <Switch defaultChecked={false} />
  }
];

export default function Menu_General() {
    return (
    <List
        itemLayout="horizontal"
        dataSource={settingsData}
        renderItem={(item) => (
            <List.Item actions={[item.control]} style={{paddingLeft: 15, paddingRight: 15}} >
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