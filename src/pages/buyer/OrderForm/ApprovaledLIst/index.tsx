import React, {useState, useRef, useEffect} from 'react';
import styles from './index.module.scss';
import {Table, Button, Modal, Input,Form, message} from 'antd';
import {useHistory} from 'ice';
import service from '@/service/service';

const {confirm} = Modal;
const { Search, TextArea } = Input;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
};

export default function ApprovaledList () {
    const[form] = Form.useForm();
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
    const [visible, setVisible] = useState(false);
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
            render: (name, row) => (<Button type="link" onClick={() => {history.push(`/buyer/planeDetail?planeId=${row.planeId}&isForm=order`)}}>{name}</Button>),
            width: '15%',
            ellipsis: true,
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
            title: '是否通过',
            dataIndex: 'status',
            render: (state) => (
                <span style={{color: state === 2? 'rgb(221, 79, 66)' : state == 6 ? 'rgba(0,0,0, .5)' : 'rgb(14, 177, 175)'}}>{state === 2 ? '未通过' : state === 6 ? '已取消' : '已通过'}</span>
            )
        },
        {
            title: '操作',
            dataIndex: 'operate',
            width: '20%',
            render: (op, row) => (
                op.map((item, index) => {
                    return <Button key={index} disabled={row.status == 3 && index ===2 || row.status === 6 && index ===1 || row.status === 2 && index ===1 ||  row.applierId !== Number(sessionStorage.getItem('userId'))} type="link" size="small" onClick={() => {
                        if(index == 0) {
                            // 重新申请
                            form.setFieldsValue({orderId: row.orderId});
                            setVisible(true);
                        } else if (index === 1){
                            // 取消订单
                            service.updateOrder({orderId: row.orderId, status: 6}).then(res => {
                                if(res.code === 200) {
                                    message.info('取消成功');
                                    getOrders(query.current);
                                }
                            })
                        }else {
                            // 删除订单
                            confirm({
                                content: '确认删除吗？',
                                onOk: () => {
                                    service.deleteOrder({orderId: row.orderId}).then(res => {
                                        if(res.code === 200) {
                                            message.info('删除成功');
                                            getOrders(query.current);
                                        }
                                    })
                                }
                            })
                        }
                    }}>{item}</Button>
                })
            )
        }
    ]

    const showSizeChanger = (current, pageSize) => {
        query.current.pageSize = pageSize;
        query.current.pageIndex = 1;
        getOrders({...query.current, pageSize: pageSize, pageIndex: 1});
    }

    const onPageChange = (page) => {
        query.current.pageIndex = page;
        getOrders({...query.current, pageIndex: page});
    }

    const getOrders = (query?) => {
        query = query || {pageIndex: 1, pageSize: 10};
        query.status = 2;
        service.getOrders(query).then(res => {
            setData(res.data);
            setTotal(res.total);
        }).catch(err => {
            console.log(err);
        })
    }

    const handleSearch = (value) => {
        query.current.orderName = value;
        query.current.pageIndex = 1;
        getOrders({...query.current, pageIndex: 1, orderName: value});
    }

    // 重新申请订单
    const handleOk = () => {
        const values = form.getFieldsValue();
        values.status = 1;
        service.updateOrder(values).then(res => {
            if(res.code === 200) {
                message.info('重新申请成功，请到已申请列表查看');
                getOrders(query.current);
                setVisible(false);
            }
        }).catch(err => {
            setVisible(false);
        })
        form.setFieldsValue({orderId: 0, reason: ''});
    }

    useEffect(() =>{
        getOrders();
    }, [])

    return(
        <div className={styles.orderForm}>
            <Search enterButton style={{width: 250, marginBottom:10}} placeholder="请输入订单名称" onSearch={handleSearch} />
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
            <Modal title="审批" visible={visible}
            onCancel={() => setVisible(false)}
            onOk={handleOk}>
                <Form form={form} {...layout}>
                    <Form.Item name="orderId" style={{display: 'none'}}>
                        <TextArea placeholder="申请理由" autoSize={{minRows: 2, maxRows: 6}}/>
                    </Form.Item>
                    <Form.Item name="reason" label="申请理由">
                        <TextArea placeholder="申请理由" autoSize={{minRows: 2, maxRows: 6}}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
