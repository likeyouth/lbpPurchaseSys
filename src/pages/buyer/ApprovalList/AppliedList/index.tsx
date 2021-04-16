import React, { useState, useRef} from 'react';
import styles from './index.module.scss';
import { Button, Form, Table, Modal, Input, Select, message } from 'antd';
const {Option} = Select;
const {TextArea} = Input;
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

export default function ApprovaledList () {
    const [form] = Form.useForm()
    const [total, setTotal] = useState(100);
    const [visible, setVisible] = useState<boolean>(false)
    const query = useRef({
        pageIndex: 1,
        pageSize: 10,
    });

    const [selectedData, setSelectedData] = useState({selectedRows: [], selectedRowKeys: []})

    const columns = [
        {
            title: '序号',
            dataIndex: 'order',
            width: '5%'
        },
        {
            title: '劳保品名称',
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
            title: '申请人',
            dataIndex: 'applier',
            // width: '10%'
        },
        {
            title: '申请时间',
            dataIndex: 'date'
        },
        {
            title: '操作',
            dataIndex: 'operate',
            // width: '10%',
            render: (op, row) => (
                <Button type="link" onClick={() => {handleApproval(row)}}>审批</Button>
            )
        }
    ]
    const data:any[] = [];
    for(let i=0; i<100; i++) {
        data.push({
            key: i,
            order: i+1,
            name: `劳保品${i+1}`,
            img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.alicdn.com%2Fimgextra%2Fi1%2FTB1oy6wcH1YBuNjSszhXXcUsFXa_%21%210-item_pic.jpg_400x400.jpg&refer=http%3A%2F%2Fimg.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620712347&t=e207916d762d25c482170755a177b447',
            amount: 100,
            applier: `部门负责人${i}`,
            date: '2020-07-09',
            status: i % 2 ? 0 : 1
        })
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

    const rowSelected = {
        selectedRowKeys: selectedData.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedData({ selectedRowKeys: selectedRowKeys, selectedRows: selectedRows });
        },
    }

    const handleOk = () => {
        setVisible(false)
    }

    const handleApprovalAll = () => {
        if(!selectedData.selectedRows.length){
            message.error('请先选择数据')
        } else {
            console.log(selectedData.selectedRows)
            setVisible(true)
        }
    }

    const handleApproval = (row) => {
        setVisible(true)
        console.log(row)
    }
    return(
        <div className={styles.appliedList}>
            <Button style={{marginBottom: 10}} type="primary" onClick={() => {handleApprovalAll()}}>批量审批</Button>
            <Table
            rowSelection={{...rowSelected}}
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
            <Modal title="生成采购计划" visible={visible}
            onOk={handleOk}
            onCancel={() => {
                setVisible(false)
            }}
            okText="确认" cancelText="取消">
                <Form {...layout} form={form}>
                    <Form.Item name="reply" label="审批回复" rules={[{required: true}]}>
                    <TextArea
                    placeholder="审批回复内容"
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    onChange={(value) => console.log(value)} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
