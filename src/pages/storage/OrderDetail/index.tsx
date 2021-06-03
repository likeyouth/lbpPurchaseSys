import React, {useState, useRef,useEffect} from 'react';
import styles from './index.module.scss';
import {Table, Button, Modal, message} from 'antd';
import service from '@/service/service';
import {useSearchParams} from 'ice';

const {confirm} = Modal;

export default function OrderDetail () {
    const [total, setTotal] = useState<number>(100)
    const [data, setData] = useState([]);
    const {planeId} = useSearchParams();
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
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
            dataIndex: 'lbpName',
            // width: '15%'
        },
        {
            title: '图片',
            dataIndex: 'img',
            align: 'center',
            // width: '20%',
            render: (url, record) => (
                <img src={url} style={{ width: 50, height: 30}}></img>
            )
        },
        {
            title: '规格',
            dataIndex: 'standard',
            ellipsis: true
        },
        {
            title: '价格',
            dataIndex: 'price'
        },
        {
            title: '申请数量',
            dataIndex: 'num',
            // width: '10%'
        },
        {
            title: '审批人',
            dataIndex: 'replier',
            // width: '10%'
        },
        {
            title: '申请回复',
            dataIndex: 'replyContent',
            // width: '20%'
        },
        {
            title: '创建日期',
            dataIndex: 'createdAt'
        },
        // {
        //     title: '操作',
        //     dataIndex: 'operate',
        //     width: '8%',
        //     render: (op, row) => (
        //         <Button disabled={row.isArrival === 1} type="link" onClick={() => {handleArrival(row)}}>是否到货</Button>
        //     )
        // }
    ]

    const handleArrival = (row) => {
        confirm({
            content: '确认到货？',
            onOk: () => {
                service.changeArrival({replyId: row.replyId}).then(res => {
                    if(res.code === 200) {
                        message.info('操作成功');
                        getApprovalList(query.current);
                    }
                })
            }
        })
    }

    const showSizeChanger = (current, pageSize) => {
        query.current.pageSize = pageSize;
        query.current.pageIndex = 1;
        getApprovalList({pageIndex: 1, pageSize: pageSize});
    }

    const onPageChange = (page) => {
        query.current.pageIndex = page;
        getApprovalList({pageIndex: page, pageSize:query.current.pageSize});
    }

    const getApprovalList = (query?) => {
        query = query || {pageSize: 10, pageIndex:1};
        query.planeId = planeId;
        service.getApprovalList(query).then(res => {
            setData(res.data);
            setTotal(res.total);
        })
    }

    const handleAll = () => {
        service.changeArrival({replyId: selectedRowKeys}).then(res => {
            if(res.code === 200) {
                message.info('操作成功');
                getApprovalList(query.current);
                setSelectedRowKeys([]);
            }
        })
    }

    const rowSelected = {
        selectedRowKeys: selectedRowKeys,
        onChange: selectedKeys => {setSelectedRowKeys(selectedKeys)},
        getCheckboxProps: (record) => ({
            disabled: record.isArrival === 1
        })
    }

    useEffect(() => {
        getApprovalList();
    }, [])

    return(
        <div className={styles.detail}>
            <h4 style={{marginBottom:20}} className={styles.title}>订单详情</h4>
            {/* <Button type="primary" onClick={handleAll} style={{marginBottom: 10}}>一键确认</Button> */}
            <Table size="small" bordered scroll={{y: 450}}
            // @ts-ignore
            dataSource={data} columns={columns}
            pagination={{
                total: total,
                showQuickJumper: true,
                onChange: onPageChange,
                onShowSizeChange: showSizeChanger,
                showSizeChanger: true,
                showTotal: (total, range) => `当前${range[0]}-${range[1]}条，共${total}条`
            }}></Table>
        </div>
    )
}
