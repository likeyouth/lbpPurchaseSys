import React, { useState, useRef, useEffect } from 'react';
import styles from './index.module.scss';
import { Table, Button, Modal, Input, message, Form, DatePicker, Rate, InputNumber, Row, Col } from 'antd';
import service from '@/service/service';
import { useHistory } from 'ice';
import moment from 'moment';

const { Search } = Input;
const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
};

export default function OrderForm() {
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const history = useHistory();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [visible, setVisible] = useState(false);
    const [isArrival, setIsArrival] = useState(true);
    const [visible1, setVisible1] = useState(false);
    const initialValue = { orderId: 0, realTime: moment(new Date()) };
    const query = useRef({
        pageIndex: 1,
        pageSize: 10,
        orderName: ''
    });
    const preServiceDesc = ['态度冷漠，解答少数售前问题', '态度良好，能解答大多售前问题', '态度非常好，能解答所有售前问题'];
    const afterServiceDesc = ['态度冷漠，解答少数售后问题', '态度良好，能解答大多售后问题', '态度非常好，能解答所有售后问题'];
    const creditDesc = ['合作成功率一般', '合作成功率良好', '合作成功率高'];
    const columns = [
        {
            title: '序号',
            dataIndex: 'order',
            width: '5%'
        },
        {
            title: '订单名称',
            dataIndex: 'name',
            width: '20%',
            render: (name, row) => (<Button type="link" onClick={() => { history.push(`/storage/orderDetail?planeId=${row.planeId}`) }}>{name}</Button>)
        },
        {
            title: '申请者',
            dataIndex: 'applier'
        },
        {
            title: '申请原因',
            dataIndex: 'reason',
        },
        {
            title: '订单价格',
            dataIndex: 'amount'
        },
        {
            title: '供应商',
            dataIndex: 'supplier'
        },
        {
            title: '审批回复',
            dataIndex: 'replyContent'
        },
        {
            title: '创建日期',
            dataIndex: 'createdAt'
        },
        {
            title: '预计到达',
            dataIndex: 'scheduledTime',
            render: (scheduledTime, row) => (
                scheduledTime ? scheduledTime : '未填写'
            )
        },
        {
            title: '实际到达',
            dataIndex: 'realTime',
            render: (realTime) => (
                realTime ? realTime : '未填写'
            )
        },
        {
            title: '操作',
            dataIndex: 'op',
            width: '10%',
            render: (op, row) => (
                ['是否到货', '评价'].map((item, index) => {
                    return <Button key={index} style={{ padding: 0, paddingRight: 5 }} disabled={index === 0 && row.status === 5 || row.status !== 5 && index === 1} onClick={() => { handleClick(index, row) }} type="link">{index === 1 && row.isEvaluated ? '查看' : item}</Button>
                })
            )
        }
    ]

    const getScore = (rate) => {
        if (rate === 1) {
            return 5;
        } else if (rate === 2) {
            return 7.5;
        } else {
            return 10;
        }
    }

    const getRate = (score) => {
        if(score == 5) {
            return 1;
        } else if(score == 7.5) {
            return 2;
        } else {
            return 3;
        }
    }

    const handleClick = (index, row) => {
        if (index === 1) {
            if (row.isEvaluated) {
                // 订单查看
                service.getEvaluation({ orderId: row.orderId }).then(res => {
                    res.preService = getRate(res.preService);
                    res.afterService = getRate(res.afterService);
                    res.credit = getRate(res.credit);
                    res.ord = res.ord + '%';
                    res.passRate = res.passRate +'%';
                    res.returnRate = res.returnRate +'%';
                    res.quality = res.quality +'%';
                    res.avgPrice = res.avgPrice + '%';
                    res.lowestPrice = res.lowestPrice + '%';
                    form1.setFieldsValue(res);
                    setVisible1(true);
                })
            } else {
                // 评价订单
                setIsArrival(false);
                setVisible(true);
                form.setFieldsValue({ orderId: row.orderId, planeId: row.planeId, supplierId: row.supplierId, amount: row.amount });
            }
        } else {
            // 确认到货
            setVisible(true);
            setIsArrival(true);
            form.setFieldsValue({ orderId: row.orderId });
        }
    }

    const handleOk = () => {
        if (isArrival) {
            const values = form.getFieldsValue();
            values.realTime = values.realTime.format('YYYY-MM-DD');
            values.status = 5;
            console.log(values)
            service.updateOrder(values).then(res => {
                if (res.code === 200) {
                    message.info('到货成功');
                    getOrders(query.current);
                    setVisible(false);
                }
            }).catch(err => {
                setVisible(false);
            })
            form.setFieldsValue(initialValue);
        } else {
            form.validateFields().then(values => {
                values.preService = getScore(values.preService);
                values.afterService = getScore(values.afterService);
                values.credit = getScore(values.credit);
                values.quality = Math.round(values.isoNum / values.isoNumAll * 100);
                let amount = parseFloat(values.amount);
                // 最低价格比率 = (订单价格-市场最低价格) / 市场最低价格 * 100 结果为正数，代表订单价格高于最低价格
                values.lowestPrice = Math.round((amount - values.lowestPrice) /values.lowestPrice * 100);
                // 平均价格比率 = (订单价格-市场平均价格) / 市场平均价格 * 100 结果为正数，代表订单价格高于平均价格
                values.avgPrice = Math.round((amount - values.avgPrice) / values.avgPrice * 100);
                service.addEvaluation(values).then(res => {
                    if(res.code === 200) {
                        setVisible(false);
                        getOrders(query.current);
                        form.resetFields();
                        message.info('评价成功');
                    }
                })
            })
        }
    }

    const showSizeChanger = (current, pageSize) => {
        query.current.pageSize = pageSize
        query.current.pageIndex = 1
    }

    const onPageChange = (page) => {
        console.log(page)
        query.current.pageIndex = page
    }

    const handleSearch = (value) => {
        query.current.orderName = value;
        query.current.pageIndex = 1;
        getOrders({ pageIndex: 1, pageSize: query.current.pageSize, orderName: value });
    }

    const getOrders = (query?) => {
        query = query || { pageIndex: 1, pageSize: 10 };
        query.roleId = 4; // 库存管理员只能获取状态为已付款和到货的订单
        service.getOrders(query).then(res => {
            setData(res.data);
            setTotal(res.total);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getOrders();
    }, [])

    return (
        <div className={styles.orderForm}>
            <h4 className={styles.title}>订单管理</h4>
            <div className={styles.search}>
                <Search style={{ width: 250, marginRight: 15 }} placeholder="请输入劳保品名称" onSearch={handleSearch} enterButton />
            </div>
            <Table
                size="small"
                bordered
                scroll={{ y: 400 }}
                dataSource={data}
                columns={columns}
                pagination={{
                    total: total,
                    showQuickJumper: true,
                    onChange: onPageChange,
                    onShowSizeChange: showSizeChanger,
                    showTotal: (total, range) => `当前${range[0]}-${range[1]}条，共${total}条`
                }}></Table>
            <Modal title={isArrival ? '订单到达时间' : '订单评价'} visible={visible}
                onCancel={() => {
                    setVisible(false);
                    form.resetFields();
                }}
                onOk={handleOk}>
                {
                    isArrival ?
                        <Form initialValues={initialValue} form={form} {...layout}>
                            <Form.Item name="orderId" style={{ display: 'none' }}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="realTime" label="实际到货">
                                <DatePicker style={{ width: 250 }} />
                            </Form.Item>
                        </Form> :
                        <Form form={form} {...layout}>
                            <Row>
                                <Col span={12}>
                                    <Form.Item name="preService" label="售前服务" rules={[{ required: true, message: '请为售前服务打分' }]}>
                                        <Rate count={3} tooltips={preServiceDesc} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="afterService" label="售后服务" rules={[{ required: true, message: '请为售后服务打分' }]}>
                                        <Rate count={3} tooltips={afterServiceDesc} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item name="credit" label="企业信用" rules={[{ required: true, message: '请为企业信用打分' }]}>
                                        <Rate count={3} tooltips={creditDesc} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="passNum" label="合格数" rules={[{ required: true, message: '请输入劳保品合格数' }]}>
                                        <InputNumber min={1} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item name="isoNumAll" label="应通过ISO数" rules={[{ required: true, message: '请输入应该通过ISO劳保品数' }]}>
                                        <InputNumber min={1} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="isoNum" label="通过ISO数" rules={[{ required: true, message: '请输入劳保品通过ISO劳保品数' }]}>
                                        <InputNumber min={0} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item name="needNum" label="所需劳保品数" rules={[{ required: true, message: '请输入劳保品所需总数' }]}>
                                        <InputNumber min={0} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="rightNum" label="准确数" rules={[{ required: true, message: '请输入劳保品准确数' }]}>
                                            <InputNumber min={0} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item name="avgPrice" label="市场平均价" rules={[{ required: true, message: '请输入市场平均价' }]}>
                                        <InputNumber min={0} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="lowestPrice" label="市场最低价" rules={[{ required: true, message: '请输入市场最低价' }]}>
                                        <InputNumber min={0} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item name="orderId" style={{ display: 'none' }}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="planeId" style={{ display: 'none' }}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="supplierId" style={{ display: 'none' }}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="amount" style={{ display: 'none' }}>
                                <Input />
                            </Form.Item>
                        </Form>
                }
            </Modal>
            <Modal title="订单评价查看" visible={visible1} onOk={() => { setVisible1(false) }} onCancel={() => { setVisible1(false) }}>
                <Form form={form1} {...layout}>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="preService" label="售前服务">
                                <Rate count={3} tooltips={preServiceDesc} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="afterService" label="售后服务" >
                                <Rate count={3} tooltips={afterServiceDesc} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="credit" label="企业信用">
                                <Rate count={3} tooltips={creditDesc} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="ord" label="交货准确率">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="otd" label="交货及时率">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="supplierLevel" label="供货能力">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="avgPrice" label="平均价格比率">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="lowestPrice" label="最低价格比率">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="returnRate" label="退货率">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="passRate" label="合格率">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="quality" label="质量等级">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    )
}
