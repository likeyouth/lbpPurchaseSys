import React, {useState, useRef} from 'react';
import styles from './index.module.scss';
import {Table, Button, Modal, Input} from 'antd';
import {useHistory} from 'ice';

const {confirm} = Modal;
const { Search } = Input;

export default function OrderForm () {
    const history = useHistory();
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
            title: '订单名称',
            dataIndex: 'name',
            render: (name) => (<Button type="link" onClick={() => {history.push('/admin/orderTail')}}>{name}</Button>)
        },
        {
            title: '申请者',
            dataIndex: 'applier'
        },
        {
            title: '申请原因',
            dataIndex: 'reason',
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
                <Button type="link" size="small" onClick={() => {
                    confirm({
                        content: '确认删除吗？',
                        onOk: () => {console.log('删除')}
                    })
                }}>删除</Button>
            )
        }
    ]

    const data:any[] = [];
    for(let i=0; i<100; i++) {
        data.push({
            key: i,
            order: i+1,
            name: `订单${i+1}`,
            applier: `采购员${i+1}`,
            reason: '库存不够了',
            price: 100089+i,
            supplier: `供应商${i+1}`,
            date: '2020-04-13',
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
        <div className={styles.orderForm}>
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
