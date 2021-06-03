import React, {useState, useRef, useEffect} from 'react';
import styles from './index.module.scss';
import {Table, Button, Modal, Input, Form, DatePicker, message, Col, Row, Rate} from 'antd';
import {useHistory} from 'ice';
import service from '@/service/service';
import moment from 'moment';
const { Search } = Input;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
};
const layout1 = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
};

export default function PassedList (props: {status, isStatusChange, setChange}) {
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const {status, setChange, isStatusChange} = props;
    const [data, setData] = useState([]);
    const [total,setTotal] = useState(0);
    const [visible1, setVisible1] = useState(false);
    const [visible, setVisible] = useState(false);
    const initialValue = {orderId: 0,scheduledTime: moment(new Date())}
    const history = useHistory();
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
            width: '15%',
            render: (name, row) => (<Button type="link" onClick={() => {history.push(`/buyer/planeDetail?planeId=${row.planeId}&isForm=order`)}}>{name}</Button>)
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
        }
    ]

    if(status === 4) {
        columns.push({
            title: '付款时间',
            dataIndex: 'payTime',
            render: (payTime,row) => (
                payTime ? payTime : '未填写'
            )
        },{
            title: '操作',
            dataIndex: 'operate',
            render: (op, row) => (
                <Button type="link" onClick={() => {
                    setVisible(true);
                    form.setFieldsValue({orderId: row.orderId});
                }} disabled={row.scheduledTime}>预计到达</Button>
            )
        })
    } else {
        columns.push({
            title: '实际到达',
            dataIndex: 'realTime',
            render: (realTime) => (
                realTime ? realTime : '未填写'
            )
        }, {
            title: '操作',
            dataIndex: 'operate',
            render: (op, row) => (
                <Button type="link" onClick={() => {
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
                }} disabled={!row.isEvaluated}>查看评价</Button>
            )
        })
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

    const handleOk = () => {
        const values = form.getFieldsValue();
        values.scheduledTime = values.scheduledTime.format('YYYY-MM-DD');
        service.updateOrder(values).then(res => {
            if(res.code === 200) {
                message.info('添加成功');
                getOrders(query.current);
                setVisible(false);
            }
        }).catch(err => {
            setVisible(false);
        })
        form.setFieldsValue(initialValue);
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
        getOrders({pageIndex: 1, pageSize: query.current.pageSize, orderName: value});
    }

    const getOrders = (query?) => {
        query = query || {pageIndex: 1, pageSize: 10};
        if(status === 4) {
            // 已付款
            query.status = 4;
        } else {
            // 已到货
            query.status=5;
        }
        service.getOrders(query).then(res => {
            setData(res.data);
            setTotal(res.total);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getOrders();
    }, []);

    useEffect(() => {
        if(isStatusChange) {
            getOrders(query.current);
            setChange(false);
        }
    }, [isStatusChange])
    return(
        <div style={{paddingBottom: data.length === 0 ? 20 : 0}} className={styles.orderForm}>
            <Search style={{width: 250, marginBottom: 10}} enterButton placeholder="请输入订单名称" onSearch={handleSearch}/>
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
            <Modal title="订单预计到达时间" visible={visible}
            onCancel={() => setVisible(false)}
            onOk={handleOk}>
                <Form initialValues={initialValue} form={form} {...layout}>
                    <Form.Item name="orderId" style={{display: 'none'}}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="scheduledTime" label="预计到货">
                        <DatePicker style={{width: 250}}/>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal title="订单评价查看" visible={visible1} onOk={() => { setVisible1(false) }} onCancel={() => { setVisible1(false) }}>
                <Form form={form1} {...layout1}>
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
