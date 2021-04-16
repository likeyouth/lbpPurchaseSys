import React, {useState, useRef} from 'react';
import styles from './index.module.scss';
import {Table, Button, Modal, Input} from 'antd';

export default function OrderDetail () {
    const [total, setTotal] = useState<number>(100)
    const [visible, setVisible] = useState<boolean>(false);
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
            title: '价格',
            dataIndex: 'price'
        },
        {
            title: '申请数量',
            dataIndex: 'amount',
            // width: '10%'
        },
        {
            title: '申请回复',
            dataIndex: 'reply',
            // width: '20%'
        },
        {
            title: '审批人',
            dataIndex: 'approver',
            // width: '10%'
        },
        {
            title: '创建日期',
            dataIndex: 'date'
        }
    ]
    const data:any = [];
    for(let i=0; i<100; i++) {
        data.push({
            key: i,
            order: i+1,
            name: `劳保品${i+1}`,
            img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.alicdn.com%2Fimgextra%2Fi1%2FTB1oy6wcH1YBuNjSszhXXcUsFXa_%21%210-item_pic.jpg_400x400.jpg&refer=http%3A%2F%2Fimg.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620712347&t=e207916d762d25c482170755a177b447',
            amount: 100,
            reply: '已加入采购计划',
            price: 100988+i,
            approver: 'XXX',
            date: '2020-4-30'
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

    const handleOk = () => {
        setVisible(false)
    }

    return(
        <div className={styles.detail}>
            <h4 className={styles.title}>采购计划详情</h4>
            <Button style={{marginBottom: 15}} type="primary" onClick={() => {setVisible(true)}}>生成订单</Button>
            <Table size="small" bordered scroll={{y: 500}}
            dataSource={data} columns={columns}
            pagination={{
                total: total,
                showQuickJumper: true,
                onChange: onPageChange,
                onShowSizeChange: showSizeChanger,
                showTotal: (total, range) => `当前${range[0]}-${range[1]}条，共${total}条`
            }}></Table>
            <Modal title="生成订单" visible={visible}
            onOk={handleOk}
            onCancel={() => {setVisible(false)}}>
                添加供应商：<Input style={{width: 250}} placeholder="请输入供应商名称" />
            </Modal>
        </div>
    )
}