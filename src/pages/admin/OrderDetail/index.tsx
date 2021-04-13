import React, {useState, useRef} from 'react';
import styles from './index.module.scss';
import {Table, Button, Col} from 'antd';

export default function OrderDetail () {
    const [total, setTotal] = useState<number>(100)
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
            reason: '库存不足需购',
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

    return(
        <div className={styles.detail}>
            <h4 className={styles.title}>订单详情</h4>
            <Table size="small" bordered scroll={{y: 500}}
            dataSource={data} columns={columns}
            pagination={{
                total: total,
                showQuickJumper: true,
                onChange: onPageChange,
                onShowSizeChange: showSizeChanger,
                showTotal: (total, range) => `当前${range[0]}-${range[1]}条，共${total}条`
            }}></Table>
        </div>
    )
}
