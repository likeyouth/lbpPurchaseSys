import React, {useState, useRef, useEffect} from 'react';
import styles from './index.module.scss';
import {Table, Button, Modal, Input, Form, message} from 'antd';
import {useHistory} from 'ice';
import service from '@/service/service';

const {confirm} = Modal;
const { TextArea, Search } = Input;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
};

export default function WillApplyList () {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false)
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
            render: (name, row) => (<Button type="link" onClick={() => {history.push(`/buyer/planeDetail?planeId=${row.planeId}&isForm=order`)}}>{name}</Button>)
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
            title: '创建人',
            dataIndex: 'applier'
        },
        {
            title: '创建日期',
            dataIndex: 'createdAt'
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (op, row) => (
                <div>
                    {op.map((item, index) => {
                        return <Button key={index} disabled={row.applierId !== Number(sessionStorage.getItem('userId'))} danger={index === 1} style={{marginLeft: 10}} type="link" size="small" onClick={() => {handleClick(index,row)}}>{item}</Button>
                    })}
                </div>
            )
        }
    ]

    const handleClick = (index, row) => {
        if(index) {
            confirm({
                content: '确认删除吗?',
                onOk: () => {
                    service.deleteOrder({orderId: row.orderId}).then(res => {
                        if(res.code === 200) {
                            message.info('删除成功');
                            getOrders({...query.current, status: 0});
                        }
                    })
                }
            })
        } else {
            form.setFieldsValue({orderId: row.orderId});
            setVisible(true);
        }
    }

    const showSizeChanger = (current, pageSize) => {
        query.current.pageSize = pageSize;
        query.current.pageIndex = 1;
        getOrders({pageIndex: 1, pageSize: pageSize, orderName: query.current.orderName, status: 0});
    }

    const onPageChange = (page) => {
        query.current.pageIndex = page;
        getOrders({pageIndex: page, pageSize: query.current.pageSize, orderName: query.current.orderName, status: 0});
    }

    const handleSearch = (value) => {
        query.current.orderName = value;
        query.current.pageIndex = 1;
        getOrders({pageIndex: 1, pageSize: query.current.pageSize, orderName: value, status: 0});
    }

    // 订单申请
    const handleOk = () => {
        const values = form.getFieldsValue();
        values.status = 1;
        service.updateOrder(values).then(res => {
            if(res.code === 200) {
                message.info('申请成功，请到已申请列表查看');
                getOrders({...query.current, status: 0});
                setVisible(false);
            }
        }).catch(err => {
            setVisible(false);
        })
        form.setFieldsValue({orderId: 0, reason: ''});
    }

    const getOrders = (query?) => {
        query = query || {pageIndex: 1, pageSize: 10, status: 0};
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
            <Modal title="审批" visible={visible}
            onCancel={() => setVisible(false)}
            onOk={() => {handleOk()}}>
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
