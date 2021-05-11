import React, {useState, useRef} from 'react';
import styles from './index.module.scss';
import {Table, Button, Modal, Input, Form, Radio, Row, message} from 'antd';
import {useHistory} from 'ice';

const {confirm} = Modal;
const { TextArea } = Input;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
};

export default function OrderForm () {
    const history = useHistory();
    const [total, setTotal] = useState<number>(100)
    const [visible, setVisible] = useState<boolean>(false)
    const query = useRef({
        pageIndex: 1,
        pageSize: 10,
    });

    const [selectedData, setSelectedData] = useState({ selectedRowKeys: [], selectedRows: [] });

    const rowData = {
        selectedRowKeys: selectedData.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedData({ selectedRowKeys: selectedRowKeys, selectedRows: selectedRows });
        },
    };
    const columns = [
        {
            title: '序号',
            dataIndex: 'order',
            width: '5%'
        },
        {
            title: '订单名称',
            dataIndex: 'name',
            render: (name) => (<Button type="link" onClick={() => {history.push('/admin/orderTail')}}>{name}</Button>)
        },
        {
            title: '订单价格',
            dataIndex: 'price'
        },
        {
            title: '供应商',
            dataIndex: 'supplier'
        },
        {
            title: '创建日期',
            dataIndex: 'date'
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (op, row) => (
                <div>
                    {op.map((item, index) => {
                        return <Button key={index} danger={index === 1} style={{marginLeft: 10}} type="link" size="small" onClick={() => {handleClick(index,row)}}>{item}</Button>
                    })}
                </div>
            )
        }
    ]

    const data:any[] = [];
    for(let i=0; i<100; i++) {
        data.push({
            key: i,
            order: i+1,
            name: `订单${i+1}`,
            applier: `供应商${i+1}`,
            reason: '库存不够',
            price: 103948+i,
            date: '2020-03-05',
            supplier: '供应商xxx',
            operate: ['申请', '删除']
        })
    }

    const handleClick = (index, row) => {
        if(index) {
            confirm({
                content: '确认删除吗?',
                onOk: () => {console.log('删除了')}
            })
        } else {
            setVisible(true)
        }
    }

    const showSizeChanger = (current, pageSize) => {
        console.log(current, pageSize)
        query.current.pageSize = pageSize
        query.current.pageIndex = 1
    }

    const onPageChange = (page) => {
        console.log(page)
        query.current.pageIndex = page
    }

    const handleApproval = () => {
        if(!selectedData.selectedRows.length) {
            message.warn('请先勾选数据')
        } else {
            console.log(selectedData)
            setVisible(true)
        }
    }
    const handleOk = () => {
        setVisible(false)
    }

    return(
        <div className={styles.orderForm}>
            <Button style={{marginBottom: 10}} type="primary" onClick={() => {handleApproval()}}>一键申请</Button>
            <Table
            rowSelection={{
                ...rowData
            }}
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
                <Form {...layout}>
                    <Form.Item name="reason" label="申请理由" rules={[{required: true}]}>
                        <TextArea placeholder="申请理由" autoSize={{minRows: 2, maxRows: 6}}
                        onChange={(value) => {console.log(value)}} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
