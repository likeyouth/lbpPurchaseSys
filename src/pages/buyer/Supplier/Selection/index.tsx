import React from 'react';
import styles from './index.module.scss';
import { Input, Form, message, Row, Col } from 'antd';

export default function () {
    const [form] = Form.useForm();
    return (
        <div className={styles.selection}>
            <h4 className={styles.title}>供应商选择</h4>
            <Form form={form}>
                <Row gutter={5} style={{marginBottom:10}}>
                    <Col span={2}></Col>
                    <Col span={2}>产品合格率</Col>
                    <Col span={2}>产品质量等级</Col>
                    <Col span={2}>产品退货率</Col>
                    <Col span={2}>采购价格</Col>
                    <Col span={2}>运输费用</Col>
                    <Col span={2}>技术水平</Col>
                    <Col span={2}>企业信用</Col>
                    <Col span={2}>交货及时率</Col>
                    <Col span={2}>交货准确率</Col>
                    <Col span={2}>售前服务</Col>
                    <Col span={2}>售后服务</Col>
                </Row>
                <Row>
                    <Col span={2}>产品合格率</Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                </Row>
                <Row>
                    <Col span={2}>产品质量等级</Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                </Row>
                <Row>
                    <Col span={2}>产品退货率</Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                </Row>
                <Row>
                    <Col span={2}>采购价格</Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                </Row>
                <Row>
                    <Col span={2}>运输费用</Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                </Row>
                <Row>
                    <Col span={2}>技术水平</Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                </Row>
                <Row>
                    <Col span={2}>企业信用</Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                </Row>
                <Row>
                    <Col span={2}>交货及时率</Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}></Col>
                </Row>
                <Row>
                    <Col span={2}>交货准确率</Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}></Col>
                </Row>
                <Row>
                    <Col span={2}>售后服务</Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                </Row>
                <Row>
                    <Col span={2}>售前服务</Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                    <Col span={2}><Input style={{width: 70, marginBottom:10}}/></Col>
                </Row>
            </Form>
        </div>
    )
}
