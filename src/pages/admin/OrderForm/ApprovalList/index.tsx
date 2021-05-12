import React, {useState, useRef, useEffect} from 'react';
import styles from './index.module.scss';
import {Table, Button, Input} from 'antd';
import {useHistory} from 'ice';
import service from '@/service/service';
const { Search } = Input;

export default function ApprovaledList (props: {setApproval,isApprovaled}) {
    const {setApproval,isApprovaled} = props;
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
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
            render: (name, row) => (<Button type="link" onClick={() => {history.push(`/admin/orderTail?planeId=${row.planeId}`)}}>{name}</Button>),
            width: '15%',
            ellipsis: true,
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
            title: '审批回复',
            dataIndex: 'replyContent'
        },
        {
            title: '创建日期',
            dataIndex: 'createdAt'
        },
        {
            title: '是否通过',
            dataIndex: 'status',
            render: (state) => (
                <span style={{color: state === 2? 'rgb(221, 79, 66)' : state == 6 ? 'rgba(0,0,0, .5)' : 'rgb(14, 177, 175)'}}>{state === 2 ? '未通过' : state === 6 ? '已取消' : '已通过'}</span>
            )
        }
    ]

    const showSizeChanger = (current, pageSize) => {
        query.current.pageSize = pageSize;
        query.current.pageIndex = 1;
        getOrders({...query.current, pageSize: pageSize, pageIndex: 1});
    }

    const onPageChange = (page) => {
        query.current.pageIndex = page;
        getOrders({...query.current, pageIndex: page});
    }

    const getOrders = (query?) => {
        query = query || {pageIndex: 1, pageSize: 10};
        query.status = 2;
        service.getOrders(query).then(res => {
            setData(res.data);
            setTotal(res.total);
        }).catch(err => {
            console.log(err);
        })
    }

    const handleSearch = (value) => {
        query.current.orderName = value;
        query.current.pageIndex = 1;
        getOrders({...query.current, pageIndex: 1, orderName: value});
    }

    useEffect(() =>{
        getOrders();
    }, [])

    useEffect(() => {
        if(isApprovaled) {
            getOrders(query.current);
            setApproval(false);
        }
    }, [isApprovaled])

    return(
        <div className={styles.orderForm}>
            <Search enterButton style={{width: 250, marginBottom:10}} placeholder="请输入订单名称" onSearch={handleSearch} />
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
