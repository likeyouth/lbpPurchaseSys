import React, {useState, useRef} from 'react';
import styles from './index.module.scss';
import {Table, Button, Modal, Input, Form, Radio, Row, message} from 'antd';
import {history} from 'ice';

const {confirm} = Modal;

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
            width: '5%'
        },
        {
            title: '采购计划名称',
            dataIndex: 'name',
            render: (name) => (<Button type="link" onClick={() => {history.push('/buyer/planeDetail')}}>{name}</Button>)
        },
        {
            title: '创建日期',
            dataIndex: 'date'
        },
        {
            title: '是否已生成订单',
            dataIndex: 'status',
            render: (status) => <span style={{color: status===0? 'rgb(221, 79, 67' : '#333'}}>{status===0 ? '否' : '是'}</span>
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (op, row) => (
                <div>
                    {op.map((item, index) => {
                        return <Button disabled={index === 0 && row.status !==0} key={index} danger={index === 1} style={{marginLeft: 10}} type="link" size="small" onClick={() => {handleClick(index,row)}}>{item}</Button>
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
            name: `采购计划${i+1}`,
            date: '2020-03-05',
            status: i % 2 ? 0 : 1,
            supplier: '供应商xxx',
            operate: ['生成订单', '删除']
        })
    }

    const handleClick = (index, row) => {
        if(index) {
            confirm({
                content: '确认删除吗?',
                onOk: () => {console.log('删除了')}
            })
        } else {
            history.push('/buyer/planeDetail')
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

    return(
        <div className={styles.orderForm}>
            <h4 className={styles.title}>采购计划</h4>
            <Table
            size="small"
            bordered
            scroll={{ y: 500 }}
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
