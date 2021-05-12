import React, {useState, useRef, useEffect} from 'react';
import styles from './index.module.scss';
import {Table, Button, Modal, Input, message, Form, Radio} from 'antd';
import {useHistory} from 'ice';
import service from '@/service/service';

const { Search, TextArea } = Input;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
};

export default function AppliedList (props: {setApproval}) {
    const {setApproval} = props;
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
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
            render: (name, row) => (<Button type="link" onClick={() => {history.push(`/admin/orderTail?planeId=${row.planeId}`)}}>{name}</Button>)
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
            title: '创建日期',
            dataIndex: 'createdAt'
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (op, row) => (
                <Button type="link" size="small" onClick={() => {
                    setVisible(true);
                    form.setFieldsValue({orderId: row.orderId});
                }}>审批</Button>
            )
        }
    ]

    const showSizeChanger = (current, pageSize) => {
        query.current.pageSize = pageSize;
        query.current.pageIndex = 1;
        getOrders({...query.current, pageIndex: 1, pageSize: pageSize});
    }

    const onPageChange = (page) => {
        query.current.pageIndex = page;
        getOrders({...query.current, pageIndex: page});
    }

    const handleSearch = (value) => {
        query.current.orderName = value;
        query.current.pageIndex = 1;
        getOrders({...query.current, pageIndex: 1, orderName: value});
    }

    const getOrders = (query?) => {
        query = query || {pageIndex: 1, pageSize: 10};
        query.status = 1;
        service.getOrders(query).then(res => {
            setData(res.data);
            setTotal(res.total);
        }).catch(err => {
            console.log(err);
        })
    }

    const handleOk = () => {
        const values = form.getFieldsValue();
        const approvalerId = Number(sessionStorage.getItem('userId'));
        values.approvalerId = approvalerId;
        service.updateOrder(values).then(res => {
            if(res.code === 200) {
                message.info('审批成功，请到已审批列表查看');
                getOrders(query.current);
                setApproval(true);
                setVisible(false);
                form.setFieldsValue({orderId: 0, replyContent: '', status: 2})
            }else {
                message.info('操作失败，请稍后重试')
            }
        }).catch(err => {
            console.log(err);
            setVisible(false);
            form.setFieldsValue({orderId: 0, replyContent: '', status: 2})
        })
    }

    useEffect(() => {
        getOrders();
    }, []);
    return(
        <div className={styles.orderForm}>
            <Search style={{width: 250, marginBottom: 10}} enterButton placeholder="请输入订单名称" onSearch={handleSearch} />
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
                <Form initialValues={{status: 2}} form={form} {...layout}>
                    <Form.Item name="orderId" style={{display: 'none'}}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="是否通过" rules={[{required: true, message:'必填'}]}>
                        <Radio.Group>
                            <Radio value={2}>不通过</Radio>
                            <Radio value={3}>通过</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="replyContent" label="回复">
                        <TextArea placeholder="回复内容" autoSize={{minRows: 2, maxRows: 6}}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}