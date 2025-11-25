import { useState, useEffect } from 'react'

import { Layout, Menu, Badge, Divider } from "antd"
import Menu_General from './General'
import Menu_Profiles from './Profiles'
import Menu_Proxies from './Proxies'
import Menu_Rules from './Rules';

const { Sider, Content } = Layout;

function App() {
    const [current, setCurrent] = useState('General');

    const [connected, setConnected] = useState<boolean>(false);
    const [name, setName] = useState<string>("")
    const [Upstream, setUpstream] = useState<string>("")
    const [Downstream, setDownstream] = useState<string>("")

    const onClick = (e: any) => {
        setCurrent(e.key);
    };
    
    useEffect(() => {
        const fetchTraffic = async () => {
            const res = await fetch('http://localhost:62334/traffic', {
                method: 'GET',
            }).catch(() => {
                setConnected(false);
            });
            if(!res) return;
            const data = await res.json();
            setConnected(true);
            setName(data['name']);
            setUpstream(data['upstream']);
            setDownstream(data['downstream']);
        };
        
        const timer = setInterval(fetchTraffic, 2000);
        return () => clearInterval(timer);
    }, []);

    const renderContent = () => {
        switch (current) {
        case 'General':
            return <Menu_General />;
        case 'Profiles':
            return <Menu_Profiles />;
        case 'Proxies':
            return <Menu_Proxies />;
        case 'Rules':
            return <Menu_Rules />;
        case 'Logs':
            return <div>设置选项2的内容</div>;
        default:
            return <div>请选择菜单</div>;
        }
    };

    return (
    <div className="container">
      <Layout style={{ height: '100vh'}}>
        <Sider theme="light">
            <Menu
                onClick={onClick}
                selectedKeys={[current]}
                mode="vertical"
            >
                <Menu.Item key="General">
                    General
                </Menu.Item>
                <Menu.Item key="Profiles" >
                    Profiles
                </Menu.Item>
                <Menu.Item key="Proxies" >
                    Proxies
                </Menu.Item>
                <Menu.Item key="Rules" >
                    Rules
                </Menu.Item>
                <Menu.Item key="Logs" >
                    Logs
                </Menu.Item>
                <Menu.Item key="Connections" >
                    Connections
                </Menu.Item>
                <Menu.Item key="Settings" >
                    Settings
                </Menu.Item>
                <Menu.Item key="About" >
                    About
                </Menu.Item>
            </Menu>

            <Divider />

            <div style={{ textAlign: 'center' }}>
            {
                connected ?
                <>
                    <Badge status="success" text={name} />
                    <div>↑ {Upstream}</div>
                    <div>↓ {Downstream}</div>
                </> :
                <Badge status="error" text="Disconnected" />
            }
            </div>

        </Sider>

        <Content style={{ padding: 10, background: '#fff'}}>
            {renderContent()}
        </Content>
      </Layout>
      
    </div>
  );
}

export default App
