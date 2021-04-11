import React, {useState, useRef} from 'react';
import styles from './index.module.scss';
import { Table, Button, Modal, Form, Input, InputNumber } from 'antd';
const { TextArea } = Input;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

export default function Applied(props) {
    const [form] = Form.useForm()
    const [total, setTotal] = useState(100);
    const [amount, setAmount] = useState(0)
    const [reason, setReason] = useState('')
    const [visible, setVisible] = useState(false)
    const query = useRef({
        pageIndex: 1,
        pageSize: 10,
    });
    const columns = [
        {
            title: '序号',
            dataIndex: 'order',
            // width: '5%'
        },
        {
            title: '名称',
            dataIndex: 'name',
            // width: '15%'
        },
        {
            title: '图片',
            dataIndex: 'img',
            // width: '20%',
            render: (url, record) => (
                <img src={url} style={{ width: 50, height: 30}}></img>
            )
        },
        {
            title: '申请数量',
            dataIndex: 'amount',
            // width: '10%'
        },
        {
            title: '申请原因',
            dataIndex: 'reason',
            // width: '20%'
        },
        {
            title: '审批人',
            dataIndex: 'approver',
            // width: '10%'
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (status) => (<span>{status ? '已通过':'未通过'}</span>),
            // width: '10%'
        },
        {
            title: '操作',
            dataIndex: 'operate',
            // width: '10%',
            render: (op, row) => (
                <Button type="link" onClick={() => {handleClick(row)}}>{row.status ? '删除': '重新申请'}</Button>
            )
        }
    ]
    const data = [];
    for(let i=0; i<100; i++) {
        data.push({
            key: i,
            order: i+1,
            name: `劳保品${i+1}`,
            img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.alicdn.com%2Fimgextra%2Fi1%2FTB1oy6wcH1YBuNjSszhXXcUsFXa_%21%210-item_pic.jpg_400x400.jpg&refer=http%3A%2F%2Fimg.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620712347&t=e207916d762d25c482170755a177b447',
            amount: 100,
            reason: '库存不足需购',
            approver: 'XXX',
            status: 0
        })
    }

    const handleClick = (record) => {
        setReason(record.reason)
        setAmount(record.amount)
        console.log(record)
        setVisible(true)
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


    const handleOk = () => {
        console.log(amount,reason)
        setVisible(false)
    }
    return(
        <div className={styles.applied}>
            <div className={styles.btns}>
                <Button type="primary">已通过</Button>
                <Button type="default">待通过</Button>
            </div>
            <div className={styles.tableArea}>
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
            </div>
            <Modal title="重新申请" visible={visible}
            onOk={handleOk}
            onCancel={() => setVisible(false)}
            okText="确认" cancelText="取消">
                <Form {...layout}>
                    <Form.Item label="数量" rules={[{required: true, message: '数量必填'}]}>
                        <InputNumber value={amount} min={1} onChange={(value) => setAmount(value)}></InputNumber>
                    </Form.Item>
                    <Form.Item label="申请原因" rules={[{required: true, message: '申请原因必填'}]}>
                        <TextArea
                            value={reason}
                            placeholder="请输入申请原因"
                            autoSize={{ minRows: 2, maxRows: 6 }}
                            onChange={(value) => setReason(value)} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}