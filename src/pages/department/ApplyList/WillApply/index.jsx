import React, {useState, useRef} from 'react';
import styles from './index.module.scss';
import service from '@/service/service';
import { Table, Button, Modal, Form, Input, InputNumber, message } from 'antd';
const { TextArea } = Input;
const { confirm } = Modal;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

export default function Applied(props) {
    const [form] = Form.useForm()
    const [total, setTotal] = useState(100);
    const [amount, setAmount] = useState(0)
    const [reason, setReason] = useState('')
    const [selectedData, setSelectedData] = useState({ selectedRowKeys: [], selectedRows: [] });
    const [visible, setVisible] = useState(false)
    const query = useRef({
        pageIndex: 1,
        pageSize: 10,
    });
    const columns = [
        {
            title: '序号',
            dataIndex: 'order',
            width: '5%',
            key: 'order'
        },
        {
            title: '劳保品名称',
            dataIndex: 'lbpName',
            key: 'lbpName'
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
            title: '规格',
            dataIndex: 'standard',
            key: 'standard'
        },
        {
            title: '申请数量',
            dataIndex: 'num',
            // width: '10%'
        },
        {
            title: '操作',
            dataIndex: 'operate',
            // width: '10%',
            render: (op, row) => (
                <div>
                    {op.map((item, index) => {
                        return <Button key={index} style={{marginLeft: 10}} type="link" size="small" danger={index === 1} onClick={() => {handleClick(index,row)}}>{item}</Button>
                    })}
                </div>
            )
        }
    ]
    const data = [];
    for(let i=0; i<5; i++) {
        data.push({
            key: i+1,
            userId: 3,
            lbpId: 6,
            order: i+1,
            requestId: i+1,
            lbpName: `劳保品${i+1}`,
            standard: '37码',
            img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.alicdn.com%2Fimgextra%2Fi1%2FTB1oy6wcH1YBuNjSszhXXcUsFXa_%21%210-item_pic.jpg_400x400.jpg&refer=http%3A%2F%2Fimg.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620712347&t=e207916d762d25c482170755a177b447',
            num: 1,
            operate: ['申请', '删除']
        })
    }

    const handleClick = (index, record) => {
        if(index === 1) {
            // 删除
            confirm({
                content: <span>该条记录将被删除，是否继续？</span>,
                onOk() {
                    service.deleteRequest({requestId: record.requestId}).then(res => {
                        if(res.code === 200) {
                            message.info('删除成功');
                        } else {
                            message.error('删除失败，请稍后重试！');
                        }
                    })
                }
            })
        } else {
            // 申请
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

    const handleOk = () => {
        console.log(reason)
        setVisible(false)
    }

    const rowDelete = {
        selectedRowKeys: selectedData.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedData({ selectedRowKeys: selectedRowKeys, selectedRows: selectedRows });
        },
    };

    const handleApply = () => {
        if(selectedData.selectedRowKeys.length) {
            console.log(selectedData)
        } else {
            message.warn('请先选择数据')
        }
    }
    const handleDelete = () => {
        if(selectedData.selectedRowKeys.length) {
            confirm({
                content: <span>确认删除选中的数据吗？</span>,
                onOk() {
                    // const list = selectedData.map(item => item.requestId);
                    service.deleteRequest({requestId: selectedData.selectedRowKeys}).then(res => {
                        if(res.code === 200) {
                            message.info('删除成功');
                        } else {
                            message.info('删除失败，请稍后重试');
                        }
                    })
                }
            })
        } else {
            message.warn('请先选择数据')
        }
    }
    return(
        <div className={styles.willApply}>
            <div className={styles.btns}>
                <Button type="primary" style={{marginRight: 10}} onClick={() => handleApply()}>批量申请</Button>
                <Button type="default" onClick={() => handleDelete()}>批量删除</Button>
            </div>
            <Table
            rowSelection={{
                ...rowDelete,
            }}
            size="small"
            bordered
            scroll={{ y: 390 }}
            dataSource={data}
            columns={columns}
            pagination={{
                total: total,
                showQuickJumper: true,
                onChange: onPageChange,
                onShowSizeChange: showSizeChanger,
                showTotal: (total, range) => `当前${range[0]}-${range[1]}条，共${total}条`
            }}></Table>
            <Modal title="重新申请" visible={visible}
            onOk={handleOk}
            onCancel={() => setVisible(false)}
            okText="确认" cancelText="取消">
                <Form {...layout}>
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