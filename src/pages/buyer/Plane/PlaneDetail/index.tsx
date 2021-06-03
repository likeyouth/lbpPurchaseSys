import React, {useState, useRef,useEffect} from 'react';
import styles from './index.module.scss';
import {Table, Button, Modal, Input, Form, message, InputNumber, Select} from 'antd';
import service from '@/service/service';
import {useSearchParams, useHistory} from 'ice';
const {Option} = Select;

const {confirm} = Modal;
const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

export default function OrderDetail () {
    const history = useHistory();
    const [form] = Form.useForm();
    const [total, setTotal] = useState<number>(100)
    const [visible, setVisible] = useState<boolean>(false);
    const [visible1, setVisible1] = useState<boolean>(false);
    const [data, setData] = useState([]);
    const {planeId, isOrder, isForm, supplierId} = useSearchParams();
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const query = useRef({
        pageIndex: 1,
        pageSize: 10,
    });

    const columns = [
        {
            title: '序号',
            dataIndex: 'order',
            width: '5%'
        },
        {
            title: '名称',
            dataIndex: 'lbpName',
            width: '15%',
            elipsis: true
        },
        {
            title: '图片',
            dataIndex: 'img',
            align: 'center',
            // width: '20%',
            render: (url, record) => (
                <img src={url} style={{ width: 50, height: 30}}></img>
            )
        },
        {
            title: '规格',
            dataIndex: 'standard',
            ellipsis: true,
            width:'15%'
        },
        {
            title: '价格',
            dataIndex: 'price'
        },
        {
            title: '申请数量',
            dataIndex: 'num',
            // width: '10%'
        },
        {
            title: '审批人',
            dataIndex: 'replier',
            // width: '10%'
        },
        {
            title: '申请回复',
            dataIndex: 'replyContent',
            // width: '20%'
        },
        {
            title: '创建日期',
            dataIndex: 'createdAt'
        }
    ]

    if(isForm !== 'order') {
        columns.push({
            title: '操作',
            dataIndex: 'operate',
            width: '15%',
            render: (op, row) => (
                <>
                    <Button style={{display: isOrder === '1' ? 'none' : 'inline-block'}} type="link" onClick={() => {handleRemove(row)}}>移除</Button>
                    <Button type="link" onClick={() => {
                        setVisible1(true);
                        form.setFieldsValue({replyId: row.replyId});
                    }}>添加价格</Button>
                </>
            )
        })
    }

    const handleRemove = (row) => {
        confirm({
            content: '确认将该条记录移出采购计划吗',
            onOk: () => {
                service.updateReply({replyId: row.replyId}).then(res => {
                    if(res.code === 200) {
                        message.info('移除成功');
                        getApprovalList(query.current);
                    }
                })
            }
        })
    }

    const showSizeChanger = (current, pageSize) => {
        query.current.pageSize = pageSize;
        query.current.pageIndex = 1;
        getApprovalList({pageIndex: 1, pageSize: pageSize});
    }

    const onPageChange = (page) => {
        query.current.pageIndex = page;
        getApprovalList({pageIndex: page, pageSize:query.current.pageSize});
    }

    const handleOk = () => {
        const applierId = Number(sessionStorage.getItem('userId'));
        form.validateFields().then(values => {
            values.planeId = planeId;
            console.log(values);
            values.supplierId = supplierId || values.supplierId;
            values.applierId = applierId;
            service.addOrder(values).then(res => {
                if(res.code === 200) {
                    setVisible(false);
                    message.info('添加成功，请到采购订单中查看！')
                }
            })
        })
    }

    const getApprovalList = (query?) => {
        query = query || {pageSize: 10, pageIndex:1};
        query.planeId = planeId;
        service.getApprovalList(query).then(res => {
            setData(res.data);
            setTotal(res.total);
        })
    }

    useEffect(() => {
        getApprovalList();
    }, [])

    return(
        <div className={styles.detail}>
            <h4 className={styles.title}>{isForm === 'order' ? '订单详情' : '采购计划详情'}</h4>
            <Button style={{marginBottom: 15, display: isForm==='order' ? 'none' : 'inline-block'}} disabled={ Number(isOrder) === 1 } type="primary" onClick={() => {
                if(!supplierId) {
                    confirm({
                        content: '需要先进行供应商选择吗？',
                        onOk: () => {
                            history.push(`/buyer/selection?planeId=${planeId}`)
                        },
                        onCancel: () => {
                            setVisible(true);
                            service.getSuppliers({all: true}).then(res => {
                                setSuppliers(res.data);
                            })
                        }
                    })
                } else {
                    setVisible(true);
                }
            }}>生成订单</Button>
            <Button style={{marginLeft: 10, display: isForm==='order' ||  Number(isOrder) === 1 ? 'none' : 'inline-block'}} onClick={() => {history.push(`/buyer/selection?planeId=${planeId}`)}}>选择供应商</Button>
            <Table size="small" bordered scroll={{y: 450}}
            // @ts-ignore
            dataSource={data} columns={columns}
            pagination={{
                total: total,
                showQuickJumper: true,
                onChange: onPageChange,
                onShowSizeChange: showSizeChanger,
                showSizeChanger: true,
                showTotal: (total, range) => `当前${range[0]}-${range[1]}条，共${total}条`
            }}></Table>
            <Modal title="生成订单" visible={visible}
            onOk={handleOk}
            onCancel={() => {setVisible(false)}}>
                <Form form={form} {...layout}>
                    <Form.Item name="orderName" label="订单名称" rules={[{required: true, message: '请输入订单名称'}]}>
                        <Input placeholder="请输入订单名称"/>
                    </Form.Item>
                    {
                        !supplierId ?
                        <Form.Item name="supplierId" label="供应商选择" rules={[{required: true, message: '请选择供应商'}]}>
                            <Select>
                                {
                                    suppliers.map(item => {
                                        return <Option value={item.supplierId} key={item.supplierId}>{item.supplierName}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item> :
                        ''
                    }
                </Form>
            </Modal>
            <Modal title="添加价格" visible={visible1}
            onOk={() => {
                form.validateFields().then(values => {
                    service.updateReply(values).then(res => {
                        if(res.code === 200) {
                            message.info('添加成功');
                            getApprovalList(query.current);
                            setVisible1(false);
                        }
                    })
                })
            }}
            onCancel={() => {setVisible1(false)}}>
                <Form form={form} {...layout}>
                    <Form.Item name="replyId" style={{display: 'none'}}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="price" label="价格" rules={[{required: true, message: '请输入劳保品价格'}]}>
                        <InputNumber min={0}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
