import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { Input, Form, Modal, Select, Row, Col, Button, Radio, message } from 'antd';
const { Option } = Select;
const {confirm} = Modal;
import getWeight from '@/utils/getWeight';
import service from '@/service/service';
import {useHistory, useSearchParams} from 'ice';

export default function () {
    const query = useSearchParams();
    const history = useHistory();
    const [target, setTarget] = useState('一级指标');
    const [form] = Form.useForm();
    const [firstIndex, setFirstIndex] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [visible, setVisible] = useState(false);
    const [weight, setWeight] = useState({name: '',preService: 0, afterService: 0, ord: 0, otd: 0, credit: 0, supplierLevel: 0, avgPrice: 0, lowestPrice: 0, passRate: 0, returnRate: 0, quality: 0});
    const [supplierId, setSupplierId] = useState(0);
    const [selectWays, setWays] = useState([]);
    const handleCalc = () => {
        if(target === '一级指标') {
            form.validateFields().then(values => {
                Object.values(values).forEach((val: string, index) => {
                    values[index] = eval(val);
                });
                let weight = getWeight(values, 5);
                if(weight instanceof Array) {
                    let temp = weight[1];
                    weight[1] = weight[2];
                    weight[2] = temp;
                    setFirstIndex(weight);
                    setTarget('二级指标');
                } else {
                    // 一致性检验不通过
                    message.info('方案未通过，请调整后重新输入！');
                }
            })
        } else {
            form.validateFields().then(values => {
                Object.values(values).forEach((val: string, index) => {
                    values[index] = eval(val);
                });
                // 存放各个指标最终权重
                let result = {name: '',preService: 0, afterService: 0, ord: 0, otd: 0, credit: 0, supplierLevel: 0, avgPrice: 0, lowestPrice: 0, passRate: 0, returnRate: 0, quality: 0};
                // 服务水平指标对应权重
                let serviceLevel = getWeight([values[0]], 2);
                result.preService = firstIndex[0] * serviceLevel[0];
                result.afterService = firstIndex[0] * serviceLevel[1];
                // 供应能力指标
                let supplierLevel = getWeight([values[1]], 2);
                result.ord = firstIndex[1] * supplierLevel[0];
                result.otd = firstIndex[1] * supplierLevel[1];
                // 公司实力指标
                let ability = getWeight([values[2]], 2);
                result.credit = firstIndex[2] * ability[0];
                result.supplierLevel = firstIndex[2] * ability[1];
                // 成本价格指标
                let price = getWeight([values[3]], 2);
                result.avgPrice = firstIndex[3] * price[0];
                result.lowestPrice = firstIndex[3] * price[1];
                // 质量指标
                let quality = getWeight([values[4], values[5], values[6]], 3);
                if(quality instanceof Array) {
                    result.passRate = firstIndex[4] * quality[0];
                    result.returnRate = firstIndex[4] * quality[1];
                    result.quality = firstIndex[4] * quality[2];
                } else {
                    message.info('合格率、退货率、质量等级一致性检验错误，请检查后再输入！');
                    return
                }
                service.getScore(result).then((res:any) => {
                    setSupplierId(res.supplierId);
                    confirm({
                        content: `最佳供应商是${res.supplierName}，是否保存该选择方案?`,
                        onOk: () => {
                            setWeight(result);
                            setVisible(true);
                        }
                    })
                })
            })
        }
    }
    useEffect(() => {
        service.getWeight().then(res => {
            setWays(res);
        })
    }, []);

    // 保存方案
    const handleSave = () => {
        if(!name) {
            message.info('供应商方案名称不为空！');
        } else {
            const w = {...weight};
            w.name = name;
            service.addWeight(w).then(res => {
                if(res.code === 200) {
                    message.info('保存成功！');
                    setVisible(false);
                    setName('');
                    if(query.planeId) {
                        confirm({
                            content: '是否跳回采购计划生成页面继续生成采购计划?',
                            onOk: () => {
                                history.push(`/buyer/planeDetail?planeId=${query.planeId}&supplierId=${supplierId}`);
                            }
                        })
                    }
                }
            })
        }
    }

    const handleChange = (e) => {
        if(!firstIndex.length) {
            message.info('请先比较一级指标');
            return
        } else {
            setTarget(e.target.value);
        }
    }

    const handleSelect = (value) => {
        const weight = selectWays.filter((item: {weightId}) => item.weightId === value)[0];
        service.getScore(weight).then((res:any) => {
            confirm({
                content: `最佳供应商是${res.supplierName}，是否跳回采购计划生成页面继续生成采购计划?`,
                onOk: () => {
                    history.push(`/buyer/planeDetail?planeId=${query.planeId}&supplierId=${res.supplierId}`);
                }
            })
        })
    }

    return (
        <div className={styles.selection}>
            <h4 className={styles.title}>供应商选择</h4>
            <Select placeholder="供应商选择方案" onChange={handleSelect} style={{ width: 250, marginBottom: 20, marginRight: 10, marginTop: 10 }}>
                {
                    selectWays.map((item: {weightId, name}) => {
                        return <Option key={item.weightId} value={item.weightId}>{item.name}</Option>
                    })
                }
            </Select>
            <Radio.Group value={target} onChange={handleChange}>
                <Radio.Button value="一级指标">一级指标</Radio.Button>
                <Radio.Button value="二级指标">二级指标</Radio.Button>
            </Radio.Group>
            <Button style={{marginLeft: 10}} onClick={handleCalc}>{target === '一级指标' ? '生成一级指标权重' : '生成二级指标权重'}</Button>
            {
                target === '一级指标' ?
                    <Form form={form}>
                        <Row style={{ marginBottom: 10 }}>
                            <Col span={4}></Col>
                            <Col span={4}>服务水平</Col>
                            <Col span={4}>公司实力</Col>
                            <Col span={4}>供应能力</Col>
                            <Col span={4}>劳保品成本</Col>
                            <Col span={4}>劳保品质量</Col>
                        </Row>
                        <Row>
                            <Col span={4}>服务水平</Col>
                            <Col span={4}><Input disabled style={{ width: 70, marginBottom: 10}} /></Col>
                            <Col span={4}><Form.Item name="value1" rules={[{required: true, message: '必填'}]}><Input style={{ width: 70, marginBottom: 10}} /></Form.Item></Col>
                            <Col span={4}><Form.Item name="value2" rules={[{required: true, message: '必填'}]}><Input style={{ width: 70, marginBottom: 10}} /></Form.Item></Col>
                            <Col span={4}><Form.Item name="value3" rules={[{required: true, message: '必填'}]}><Input style={{ width: 70, marginBottom: 10}} /></Form.Item></Col>
                            <Col span={4}><Form.Item name="value4" rules={[{required: true, message: '必填'}]}><Input style={{ width: 70, marginBottom: 10}} /></Form.Item></Col>
                        </Row>
                        <Row>
                            <Col span={4}>公司实力</Col>
                            <Col span={4}><Input disabled style={{ width: 70, marginBottom: 10}} /></Col>
                            <Col span={4}><Input disabled style={{ width: 70, marginBottom: 10}} /></Col>
                            <Col span={4}><Form.Item name="value5" rules={[{required: true, message: '必填'}]}><Input style={{ width: 70, marginBottom: 10}} /></Form.Item></Col>
                            <Col span={4}><Form.Item name="value6" rules={[{required: true, message: '必填'}]}><Input style={{ width: 70, marginBottom: 10}} /></Form.Item></Col>
                            <Col span={4}><Form.Item name="value7" rules={[{required: true, message: '必填'}]}><Input style={{ width: 70, marginBottom: 10}} /></Form.Item></Col>
                        </Row>
                        <Row>
                            <Col span={4}>供应能力</Col>
                            <Col span={4}><Input disabled style={{ width: 70, marginBottom: 10}} /></Col>
                            <Col span={4}><Input disabled style={{ width: 70, marginBottom: 10}} /></Col>
                            <Col span={4}><Input disabled style={{ width: 70, marginBottom: 10}} /></Col>
                            <Col span={4}><Form.Item name="value8" rules={[{required: true, message: '必填'}]}><Input style={{ width: 70, marginBottom: 10}} /></Form.Item></Col>
                            <Col span={4}><Form.Item name="value9" rules={[{required: true, message: '必填'}]}><Input style={{ width: 70, marginBottom: 10}} /></Form.Item></Col>
                        </Row>
                        <Row>
                            <Col span={4}>劳保品成本</Col>
                            <Col span={4}><Input disabled style={{ width: 70, marginBottom: 10}} /></Col>
                            <Col span={4}><Input disabled style={{ width: 70, marginBottom: 10}} /></Col>
                            <Col span={4}><Input disabled style={{ width: 70, marginBottom: 10}} /></Col>
                            <Col span={4}><Input disabled style={{ width: 70, marginBottom: 10}} /></Col>
                            <Col span={4}><Form.Item name="value10" rules={[{required: true, message: '必填'}]}><Input style={{ width: 70, marginBottom: 10}} /></Form.Item></Col>
                        </Row>
                        <Row>
                            <Col span={4}>劳保品质量</Col>
                            <Col span={4}><Input disabled style={{ width: 70, marginBottom: 10}} /></Col>
                            <Col span={4}><Input disabled style={{ width: 70, marginBottom: 10}} /></Col>
                            <Col span={4}><Input disabled style={{ width: 70, marginBottom: 10}} /></Col>
                            <Col span={4}><Input disabled style={{ width: 70, marginBottom: 10}} /></Col>
                            <Col span={4}><Input disabled style={{ width: 70, marginBottom: 10 }} /></Col>
                        </Row>
                    </Form>
                    :
                    <Form form={form}>
                        <Row style={{ marginBottom: 50 }}>
                            <Col span={12}>
                                <Row style={{marginBottom:10}}>
                                    <Col span={8}></Col>
                                    <Col span={8}>售前服务</Col>
                                    <Col span={8}>售后服务</Col>
                                </Row>
                                <Row>
                                    <Col span={8}>售前服务</Col>
                                    <Col span={8}><Input style={{ width: 70}} disabled /></Col>
                                    <Col span={8}><Form.Item name="value11" rules={[{required: true, message: '必填'}]}><Input style={{ width: 70}} /></Form.Item></Col>
                                </Row>
                                <Row>
                                    <Col span={8}>售后服务</Col>
                                    <Col span={8}><Input style={{ width: 70}} disabled /></Col>
                                    <Col span={8}><Input style={{ width: 70}} disabled /></Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row style={{marginBottom:10}}>
                                    <Col span={8}></Col>
                                    <Col span={8}>交货准确率</Col>
                                    <Col span={8}>交货准时率</Col>
                                </Row>
                                <Row>
                                    <Col span={8}>交货准确率</Col>
                                    <Col span={8}><Input style={{ width: 70}} disabled /></Col>
                                    <Col span={8}><Form.Item name="value12" rules={[{required: true, message: '必填'}]}><Input style={{ width: 70}} /></Form.Item></Col>
                                </Row>
                                <Row>
                                    <Col span={8}>交货准时率</Col>
                                    <Col span={8}><Input style={{ width: 70}} disabled /></Col>
                                    <Col span={8}><Input style={{ width: 70}} disabled /></Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 50 }}>
                            <Col span={12}>
                                <Row style={{marginBottom:10}}>
                                    <Col span={8}></Col>
                                    <Col span={8}>公司信用</Col>
                                    <Col span={8}>供货能力</Col>
                                </Row>
                                <Row>
                                    <Col span={8}>公司信用</Col>
                                    <Col span={8}><Input style={{ width: 70}} disabled /></Col>
                                    <Col span={8}><Form.Item name="value13" rules={[{required: true, message: '必填'}]}><Input style={{ width: 70}} /></Form.Item></Col>
                                </Row>
                                <Row>
                                    <Col span={8}>供货能力</Col>
                                    <Col span={8}><Input style={{ width: 70}} disabled /></Col>
                                    <Col span={8}><Input style={{ width: 70}} disabled /></Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row style={{marginBottom:10}}>
                                    <Col span={8}></Col>
                                    <Col span={8}>平均价格比率</Col>
                                    <Col span={8}>最低价格比率</Col>
                                </Row>
                                <Row>
                                    <Col span={8}>平均价格比率</Col>
                                    <Col span={8}><Input style={{ width: 70}} disabled /></Col>
                                    <Col span={8}><Form.Item name="value14" rules={[{required: true, message: '必填'}]}><Input style={{ width: 70}} /></Form.Item></Col>
                                </Row>
                                <Row>
                                    <Col span={8}>最低价格比率</Col>
                                    <Col span={8}><Input style={{ width: 70}} disabled /></Col>
                                    <Col span={8}><Input style={{ width: 70}} disabled /></Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={16}>
                                <Row style={{marginBottom:10}}>
                                    <Col span={6}></Col>
                                    <Col span={6}>合格率</Col>
                                    <Col span={6}>退货率</Col>
                                    <Col span={6}>质量等级</Col>
                                </Row>
                                <Row>
                                    <Col span={6}>合格率</Col>
                                    <Col span={6}><Input style={{ width: 70}} disabled /></Col>
                                    <Col span={6}><Form.Item name="value15" rules={[{required: true, message: '必填'}]}><Input style={{ width: 70}} /></Form.Item></Col>
                                    <Col span={6}><Form.Item name="value16" rules={[{required: true, message: '必填'}]}><Input style={{ width: 70}} /></Form.Item></Col>
                                </Row>
                                <Row>
                                    <Col span={6}>退货率</Col>
                                    <Col span={6}><Input style={{ width: 70}} disabled /></Col>
                                    <Col span={6}><Input style={{ width: 70}} disabled /></Col>
                                    <Col span={6}><Form.Item name="value17" rules={[{required: true, message: '必填'}]}><Input style={{ width: 70}} /></Form.Item></Col>
                                </Row>
                                <Row>
                                    <Col span={6}>质量等级</Col>
                                    <Col span={6}><Input style={{ width: 70}} disabled /></Col>
                                    <Col span={6}><Input style={{ width: 70}} disabled /></Col>
                                    <Col span={6}><Input style={{ width: 70}} disabled /></Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
            }
            <Modal visible={visible} title="选择方案保存" onOk={handleSave}
            onCancel={() => {
                setName('');
                setVisible(false);
                }}>
                    <Input style={{width: 250}} onChange={(e) => {setName(e.target.value)}}  placeholder="请输入方案名称" />
            </Modal>
        </div>
    )
}