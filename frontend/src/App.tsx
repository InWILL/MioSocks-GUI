import { useState } from 'react'

import { Layout, Menu } from "antd"
import Menu_General from './General'
import Profiles_General from './Profiles'

const { Sider, Content } = Layout;

function App() {
  const [current, setCurrent] = useState('General');

  const onClick = (e: any) => {
    setCurrent(e.key);
  };

  const renderContent = () => {
    switch (current) {
      case 'General':
        return Menu_General();
      case 'Proxies':
        return <div>这是应用页面内容</div>;
      case 'Profiles':
        return Profiles_General();
      case 'Logs':
        return <div>设置选项2的内容</div>;
      default:
        return <div>请选择菜单</div>;
    }
  };

  return (
    <div className="container">
      <Layout style={{ height: '100vh' }}>
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

        <Content>
            {renderContent()}
        </Content>
      </Layout>
      
    </div>
  );
}

export default App
