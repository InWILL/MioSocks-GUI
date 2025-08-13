import React from 'react';
import { Col, Divider, Row } from 'antd';

const style: React.CSSProperties = { background: '#e9e9e9', padding: '8px 0' };

export default function Menu_Profiles() {
    return (
    <Row gutter={[16, 24]}>
      <Col className="gutter-row" span={12}>
        <div style={style}>col-6</div>
      </Col>
      <Col className="gutter-row" span={12}>
        <div style={style}>col-6</div>
      </Col>
      <Col className="gutter-row" span={12}>
        <div style={style}>col-6</div>
      </Col>
      <Col className="gutter-row" span={12}>
        <div style={style}>col-6</div>
      </Col>
      <Col className="gutter-row" span={12}>
        <div style={style}>col-6</div>
      </Col>
      <Col className="gutter-row" span={12}>
        <div style={style}>col-6</div>
      </Col>
      <Col className="gutter-row" span={12}>
        <div style={style}>col-6</div>
      </Col>
      <Col className="gutter-row" span={12}>
        <div style={style}>col-6</div>
      </Col>
    </Row>
    )
}