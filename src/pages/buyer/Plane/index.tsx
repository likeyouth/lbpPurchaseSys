import React, {useState, useRef, useEffect} from 'react';
import styles from './index.module.scss';
import service from '@/service/service';
import {Table, Button, Modal, message, Input} from 'antd';
import {useHistory} from 'ice';

const {Search} = Input;
const {confirm} = Modal;

export default function OrderForm () {
    const history = useHistory();
    const [total, setTotal] = useState<number>(100);
    const [data, setData] = useState([]);
    const query = useRef({
        pageIndex: 1,
        pageSize: 10,
        name: ''
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
            render: (name, row) => (<Button type="link" onClick={() => {history.push(`/buyer/planeDetail?planeId=${row.planeId}&isOrder=${row.isOrder}`)}}>{name}</Button>)
        },
        {
            title: '创建人',
            dataIndex: 'user'
        },
        {
            title: '是否已生成订单',
            dataIndex: 'isOrder',
            render: (isOrder) => <span style={{color: isOrder===1? 'rgb(14, 177, 175)' : '#333'}}>{isOrder === 0 ? '否' : '是'}</span>
        },
        {
            title: '创建日期',
            dataIndex: 'createdAt'
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (op, row) => (
                <div>
                    {op.map((item, index) => {
                        // 已生成订单的采购计划不允许删除和重新生成订单
                        return <Button disabled={row.isOrder ===1 || row.userId !== Number(sessionStorage.getItem('userId'))} key={index} danger={index === 1} style={{marginLeft: 10}} type="link" size="small" onClick={() => {handleClick(index,row)}}>{item}</Button>
                    })}
                </div>
            )
        }
    ]

    const handleClick = (index, row) => {
        if(index) {
            confirm({
                content: '确认删除吗?',
                onOk: () => {
                    service.deletePlane({planeId: row.planeId}).then(res => {
                        if(res.code === 200) {
                            message.info('删除成功！');
                            getPlane(query.current);
                        } else {
                            message.info('删除失败，请稍后重试！')
                        }
                    })
                }
            })
        } else {
            history.push(`/buyer/planeDetail?planeId=${row.planeId}`);
        }
    }

    const handleSearch = (val) => {
        query.current.pageSize = 1;
        query.current.name = val;
        getPlane({pageIndex: 1, pageSize: query.current.pageSize, name: val});
    }

    const showSizeChanger = (current, pageSize) => {
        query.current.pageSize = pageSize;
        query.current.pageIndex = 1;
        getPlane({pageSize: pageSize, pageIndex: 1, name: query.current.name});
    }

    const onPageChange = (page) => {
        query.current.pageIndex = page;
        getPlane({pageSize: query.current.pageSize, pageIndex: page, name: query.current.name});
    }

    const getPlane = (query?) => {
        query = query || {pageIndex: 1, pageSize: 10};
        query.isAll = true;
        service.getPlan(query).then(res => {
            setData(res.data);
            setTotal(res.total);
        }).catch(err => {
            console.log(err);
        })
    };

    useEffect(() => {
        getPlane();
    }, []);

    return(
        <div className={styles.orderForm}>
            <h4 className={styles.title}>采购计划</h4>
            <div className={styles.search}>
                <Search onSearch={handleSearch} placeholder="请输入采购计划名称" enterButton />
            </div>
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
