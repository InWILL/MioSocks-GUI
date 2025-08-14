import { useState } from 'react'

import { Layout, Menu } from "antd"
import Menu_General from './General'
import Menu_Proxies from './Proxies'
import Menu_Profiles from './Profiles'

const { Sider, Content } = Layout;

function App() {
  const [current, setCurrent] = useState('General');

  const onClick = (e: any) => {
    setCurrent(e.key);
  };

  const renderContent = () => {
    switch (current) {
      case 'General':
        return <Menu_General />;
      case 'Proxies':
        return <Menu_Proxies />;
      case 'Profiles':
        return <Menu_Profiles />;
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
                <Menu.Item key="Proxies" >
                    Proxies
                </Menu.Item>
                <Menu.Item key="Profiles" >
                    Profiles
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

            <div style={{ textAlign: 'center' }}>
                ↑
            </div>
            <div style={{ textAlign: 'center' }}>
                ↓
            </div>
            <div style={{ textAlign: 'center' }}>
                ■Connected
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
