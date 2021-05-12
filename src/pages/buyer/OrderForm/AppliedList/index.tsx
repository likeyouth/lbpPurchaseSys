import React, {useState, useRef, useEffect} from 'react';
import styles from './index.module.scss';
import {Table, Button, Modal, Input, message} from 'antd';
import {useHistory} from 'ice';
import service from '@/service/service';

const {confirm} = Modal;
const { Search } = Input;

export default function AppliedList () {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const history = useHistory();
    const query = useRef({
        pageIndex: 1,
        pageSize: 10,
        orderName: ''
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
            render: (name, row) => (<Button type="link" onClick={() => {history.push(`/buyer/planeDetail?planeId=${row.planeId}&isForm=order`)}}>{name}</Button>)
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
            dataIndex: 'amount'
        },
        {
            title: '供应商',
            dataIndex: 'supplier'
        },
        {
            title: '创建日期',
            dataIndex: 'createdAt'
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (op, row) => (
                <Button  disabled={row.applierId !== Number(sessionStorage.getItem('userId'))} type="link" size="small" onClick={() => {
                    confirm({
                        content: '确认删除吗？',
                        onOk: () => {
                            service.deleteOrder({orderId: row.orderId}).then(res => {
                                if(res.code === 200) {
                                    message.info('删除成功');
                                    getOrders(query.current);
                                }
                            })
                        }
                    })
                }}>删除</Button>
            )
        }
    ]

    const showSizeChanger = (current, pageSize) => {
        query.current.pageSize = pageSize;
        query.current.pageIndex = 1;
        getOrders({...query.current, pageIndex: 1, pageSize: pageSize});
    }

    const onPageChange = (page) => {
        query.current.pageIndex = page;
        getOrders({...query.current, pageIndex: page});
    }

    const handleSearch = (value) => {
        query.current.orderName = value;
        query.current.pageIndex = 1;
        getOrders({...query.current, pageIndex: 1, orderName: value});
    }

    const getOrders = (query?) => {
        query = query || {pageIndex: 1, pageSize: 10};
        query.status = 1;
        service.getOrders(query).then(res => {
            setData(res.data);
            setTotal(res.total);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getOrders();
    }, []);
    return(
        <div className={styles.orderForm}>
            <Search style={{width: 250, marginBottom: 10}} enterButton placeholder="请输入订单名称" onSearch={handleSearch} />
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
