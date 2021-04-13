import React, {useState, useRef} from 'react';
import styles from './index.module.scss';
import {Table, Button, Modal, Input} from 'antd';

const {confirm} = Modal;
const { Search } = Input;

export default function OrderForm () {
    const [total, setTotal] = useState<number>(100)
    const query = useRef({
        pageIndex: 1,
        pageSize: 10,
    });
    const columns = [
        {
            title: '序号',
            dataIndex: 'order',
            width: '10%'
        },
        {
            title: '订单名称',
            dataIndex: 'name'
        },
        {
            title: '申请者',
            dataIndex: 'applier'
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
                        return <Button key={index} style={{marginLeft: 10}} type="link" size="small" onClick={() => {handleClick(index,row)}}>{item}</Button>
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
            operate: ['是否到货', '评价']
        })
    }
    const handleClick = (index, row) => {
        console.log(index)
        if(index === 1) {
            // 评价订单
            console.log(row)
        } else {
            // 确认到货
            confirm({
                content: <span>确认到货吗？</span>,
                onOk() {
                    console.log('已到货')
                }
            })
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

    const onSearch = val => console.log(val)

    return(
        <div className={styles.orderForm}>
            <h4 className={styles.title}>订单管理</h4>
            <div className={styles.search}>
                <Search style={{width: 250, marginRight: 15}} placeholder="请输入劳保品名称" onSearch={onSearch} enterButton />
            </div>
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
    )
}
