import React, {useState, useRef, useEffect} from 'react';
import styles from './index.module.scss';
import {Table, Button, Modal, Input, Form, DatePicker, message} from 'antd';
import {useHistory} from 'ice';
import service from '@/service/service';
import moment from 'moment';
const { Search } = Input;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
};

export default function PassedList (props: {status, isStatusChange, setChange}) {
    const [form] = Form.useForm();
    const {status, setChange, isStatusChange} = props;
    const [data, setData] = useState([]);
    const [total,setTotal] = useState(0);
    const [visible, setVisible] = useState(false);
    const initialValue = {orderId: 0,scheduledTime: moment(new Date())}
    const history = useHistory();
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
        })
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
        </div>
    )
}
