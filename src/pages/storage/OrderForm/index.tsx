import React, {useState, useRef, useEffect} from 'react';
import styles from './index.module.scss';
import {Table, Button, Modal, Input, message, Form, DatePicker} from 'antd';
import service from '@/service/service';
import {useHistory} from 'ice';
import moment from 'moment';

const { Search } = Input;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
};

export default function OrderForm () {
    const [form] = Form.useForm();
    const history = useHistory();
    const [data, setData] = useState([]);
    const [total,setTotal] = useState(0);
    const [visible, setVisible] = useState(false);
    const initialValue = {orderId: 0,realTime: moment(new Date())}
    const query = useRef({
        pageIndex: 1,
        pageSize: 10,
        orderName: ''
    });
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
            render: (name, row) => (<Button type="link" onClick={() => {history.push(`/storage/orderDetail?planeId=${row.planeId}`)}}>{name}</Button>)
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
                    return <Button key={index} style={{padding: 0,paddingRight: 5}} disabled={index === 0 && row.status === 5 || row.status !== 5 && index === 1} onClick={() => {handleClick(index, row)}} type="link">{item}</Button>
                })
            )
        }
    ]
    const handleClick = (index, row) => {
        if(index === 1) {
            // 评价订单
            console.log(row)
        } else {
            // 确认到货
            setVisible(true);
            form.setFieldsValue({orderId: row.orderId});
        }
    }

    const handleOk = () => {
        const values = form.getFieldsValue();
        values.realTime = values.realTime.format('YYYY-MM-DD');
        values.status = 5;
        console.log(values)
        service.updateOrder(values).then(res => {
            if(res.code === 200) {
                message.info('到货成功');
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
    },[])

    return(
        <div className={styles.orderForm}>
            <h4 className={styles.title}>订单管理</h4>
            <div className={styles.search}>
                <Search style={{width: 250, marginRight: 15}} placeholder="请输入劳保品名称" onSearch={handleSearch} enterButton />
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
            <Modal title="订单到达时间" visible={visible}
            onCancel={() => setVisible(false)}
            onOk={handleOk}>
                <Form initialValues={initialValue} form={form} {...layout}>
                    <Form.Item name="orderId" style={{display: 'none'}}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="realTime" label="实际到货">
                        <DatePicker style={{width: 250}}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
